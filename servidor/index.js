const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

/* ─── Conexão com banco ───────────────────────────────────────── */
const db = mysql2.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root842",
  database: "gestantes"
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar ao MySQL:", err);
  } else {
    console.log("Conectado ao MySQL com sucesso!");
  }
});

/* ─── Inicializa servidor ────────────────────────────────────── */
app.listen(PORT, () => {
  console.log("Servidor rodando em http://localhost:" + PORT);
});

/* ─── Funções auxiliares ─────────────────────────────────────── */
const addDays = (dataStr, dias) => {
  const data = new Date(dataStr);
  data.setDate(data.getDate() + dias);
  return data.toISOString().split("T")[0]; // yyyy-mm-dd
};

const calcularDatas = (dum) => ({
  partoPrevista: addDays(dum, 280),
  transIni     : addDays(dum, 77),
  transFim     : addDays(dum, 98),
  obstIni      : addDays(dum, 154),
  obstFim      : addDays(dum, 168)
});



/* ─── GET /gestantes ─────────────────────────────────────────── */
app.get("/gestantes", (req, res) => {
  const sql = `
    SELECT 
      g.id_gestante,
      g.nome_gestante,
      g.dum,
      g.data_nasc,
      g.telefone_gestante,
      
      gest.data_parto_prevista,
      gest.observacoes AS observacao,
      
      eo.data_exame_o,
      eo.status AS status_obstetrico,
      
      et.data_exame_t,
      et.status AS status_transnucal

    FROM gestante g
    LEFT JOIN gestacao gest ON gest.fk_id_gestante = g.id_gestante
    LEFT JOIN exames ex ON ex.fk_id_gestacao = gest.id_gestacao
    LEFT JOIN exame_obstetrico eo ON eo.id_exame_obstetrico = ex.fk_id_exame_obstetrico
    LEFT JOIN exame_transnucal et ON et.id_exame_transnucal = ex.fk_id_exame_transnucal
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar gestantes com exames:", err);
      return res.status(500).json({ error: "Erro ao buscar gestantes" });
    }
    res.json(results);
  });
});




/* ─── GET /gestantes/:id ─────────────────────────────────────── */
app.get("/gestantes/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      g.*, 
      gs.*, 
      eo.data_exame_o,
      eo.status AS status_obstetrico, 
      et.data_exame_t,
      et.status AS status_transnucal
    FROM gestante g
    LEFT JOIN gestacao gs ON gs.fk_id_gestante = g.id_gestante
    LEFT JOIN exames ex ON ex.fk_id_gestacao = gs.id_gestacao
    LEFT JOIN exame_obstetrico eo ON eo.id_exame_obstetrico = ex.fk_id_exame_obstetrico
    LEFT JOIN exame_transnucal et ON et.id_exame_transnucal = ex.fk_id_exame_transnucal
    WHERE g.id_gestante = ?
  `;
  db.query(sql, [id], (err, rows) =>
    err
      ? res.status(500).json({ error: err })
      : rows.length
      ? res.json(rows[0])
      : res.status(404).json({ msg: "Gestante não encontrada" })
  );
});


app.post("/gestantes", (req, res) => {
  const { nome_gestante, data_nasc, idade_gestante, dum, telefone_gestante, observacao } = req.body;

  const datas = calcularDatas(dum);

  const sqlGestante = `
    INSERT INTO gestante (nome_gestante, data_nasc, idade_gestante, dum, telefone_gestante)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sqlGestante, [nome_gestante, data_nasc, idade_gestante, dum, telefone_gestante], (err, gestanteResult) => {
    if (err) return res.status(500).json({ error: "Erro ao inserir gestante" });

    const idGestante = gestanteResult.insertId;

    // Aqui já inclui o campo observacoes na tabela gestacao
    db.query(
      "INSERT INTO gestacao (fk_id_gestante, data_parto_prevista, observacoes) VALUES (?, ?, ?)",
      [idGestante, datas.partoPrevista, observacao || null],  // Se não passar observação, null
      (err, gestacaoResult) => {
        if (err) return res.status(500).json({ error: "Erro ao inserir gestação" });

        const idGestacao = gestacaoResult.insertId;

        // Continua o fluxo dos exames (sem alterações)
        db.query("INSERT INTO exame_transnucal (data_exame_t, status) VALUES (?, 0)", [datas.transIni], (err, transRes) => {
          if (err) return res.status(500).json({ error: "Erro no exame transnucal" });
          const idTrans = transRes.insertId;

          db.query("INSERT INTO exame_obstetrico (data_exame_o, status) VALUES (?, 0)", [datas.obstIni], (err, obstRes) => {
            if (err) return res.status(500).json({ error: "Erro no exame obstétrico" });
            const idObst = obstRes.insertId;

            db.query(
              "INSERT INTO exames (fk_id_exame_obstetrico, fk_id_exame_transnucal, fk_id_gestacao) VALUES (?, ?, ?)",
              [idObst, idTrans, idGestacao],
              (err) => {
                if (err) return res.status(500).json({ error: "Erro ao inserir exames" });

                res.status(201).json({
                  msg: `Gestante ${nome_gestante} cadastrada com sucesso!`,
                  id_gestante: idGestante,
                  datas_calculadas: datas,
                  status_inicial: "Exames marcados como NÃO agendados (0)"
                });
              }
            );
          });
        });
      }
    );
  });
});


/* ─── PUT /gestantes/:id ───────────────────────────────────────  DAQUI PRA BAIXO*/


/* PUT /gestantes/:id  */
app.put("/gestantes/:id", (req, res) => {
  const { id } = req.params;

  /* --------- valores vindos do front --------- */
  const {
    nome_gestante,
    data_nasc,
    idade_gestante,
    dum,
    telefone_gestante,
    status_obstetrico,
    status_transnucal,
    observacao = null          // textarea pode vir vazio
  } = req.body;

  /* --------- calcula TODAS as novas datas --------- */
  const datas = calcularDatas(dum);           // { partoPrevista, obstIni, transIni, … }

  /* --------- 1. atualiza gestante ---------- */
  const sqlGestante = `
    UPDATE gestante
    SET nome_gestante = ?, data_nasc = ?, idade_gestante = ?,
        dum = ?, telefone_gestante = ?
    WHERE id_gestante = ?
  `;
  db.query(
    sqlGestante,
    [nome_gestante, data_nasc, idade_gestante, dum, telefone_gestante, id],
    (err1) => {
      if (err1) return res.status(500).json({ error: "Erro ao atualizar gestante" });

      /* --------- 2. atualiza gestacao ---------- */
      const sqlGestacao = `
        UPDATE gestacao
        SET data_parto_prevista = ?, observacoes = ?
        WHERE fk_id_gestante = ?
      `;
      db.query(sqlGestacao, [datas.partoPrevista, observacao, id], (err2) => {
        if (err2) return res.status(500).json({ error: "Erro ao atualizar gestação" });

        /* --------- 3. atualiza datas & status dos exames ---------- */
        const sqlExames = `
          UPDATE exames ex
          JOIN exame_obstetrico eo ON eo.id_exame_obstetrico = ex.fk_id_exame_obstetrico
          JOIN exame_transnucal et ON et.id_exame_transnucal = ex.fk_id_exame_transnucal
          JOIN gestacao g          ON g.id_gestacao        = ex.fk_id_gestacao
          SET
            eo.data_exame_o = ?,
            eo.status       = ?,
            et.data_exame_t = ?,
            et.status       = ?
          WHERE g.fk_id_gestante = ?
        `;
        db.query(
          sqlExames,
          [datas.obstIni, status_obstetrico, datas.transIni, status_transnucal, id],
          (err3) => {
            if (err3) return res.status(500).json({ error: "Erro ao atualizar exames" });
            res.json({ msg: "Gestante atualizada com sucesso" });
          }
        );
      });
    }
  );
});



/* ─── PATCH /gestantes/:id/status ────────────────────────────── */
app.patch("/gestantes/:id/status", (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;
  const tabela = tipo === "obstetrico" ? "exame_obstetrico" : "exame_transnucal";
  const campo = tipo === "obstetrico" ? "id_exame_obstetrico" : "id_exame_transnucal";
  db.query(`SELECT status FROM ${tabela} WHERE ${campo}=?`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    if (!rows.length) return res.status(404).json({ msg: "Exame não encontrado" });
    const novoStatus = rows[0].status === 1 ? 0 : 1;
    db.query(`UPDATE ${tabela} SET status=? WHERE ${campo}=?`, [novoStatus, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ msg: `Status atualizado para ${novoStatus}` });
    });
  });
});

/* ─── DELETE /gestantes/:id ──────────────────────────────────── */
app.delete("/gestantes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM gestante WHERE id_gestante = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.affectedRows) return res.status(404).json({ msg: "Gestante não encontrada" });
    res.json({ msg: "Gestante excluída com sucesso" });
  });
});



