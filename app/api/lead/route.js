import { NextResponse } from "next/server";
import { validarTelefone } from "@/lib/phone";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function salvarNoNotion(lead) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        Nome:                { title: [{ text: { content: lead.nome } }] },
        Email:               { email: lead.email },
        Telefone:            { phone_number: lead.telefone_e164 },
        "Telefone Original": { rich_text: [{ text: { content: lead.telefone_original } }] },
        Escola:              { rich_text: [{ text: { content: lead.escola } }] },
        "Tipo Telefone":     { select: { name: lead.tipo_telefone } },
        "WhatsApp Provável": { select: { name: lead.whatsapp_provavel } },
        Origem:              { select: { name: lead.origem } },
      },
    }),
  });

  if (!res.ok) {
    const erro = await res.json();
    throw new Error(`Notion API error: ${JSON.stringify(erro)}`);
  }

  return res.json();
}

export async function POST(request) {
  try {
    const { nome, email, telefone, escola, origem } = await request.json();

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { sucesso: false, erro: "Campos obrigatórios: nome, email, telefone." },
        { status: 400 }
      );
    }

    const validacao = validarTelefone(telefone);

    if (!validacao.valido) {
      return NextResponse.json(
        { sucesso: false, erro: validacao.mensagem, campo: "telefone" },
        { status: 422 }
      );
    }

    const lead = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone_e164: validacao.e164,
      telefone_original: telefone.trim(),
      tipo_telefone: validacao.tipo,
      whatsapp_provavel: validacao.whatsapp,
      escola: escola?.trim() || "",
      origem: origem || "landing-page",
    };

    await salvarNoNotion(lead);

    return NextResponse.json(
      {
        sucesso: true,
        mensagem: "Lead registrado com sucesso.",
        telefone: {
          e164: lead.telefone_e164,
          tipo: lead.tipo_telefone,
          whatsapp: lead.whatsapp_provavel,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /lead] Erro:", error);
    return NextResponse.json(
      { sucesso: false, erro: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
