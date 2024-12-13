import { type ActionFunctionArgs } from "@remix-run/node";
import { Form, json, useActionData } from "@remix-run/react";
import { db } from "./utils/db";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const feedback = {
    opiniao: formData.get("opiniao"), 
    dificuldade: formData.get("dificuldade"),
    outrasPalestras: formData.get("outrasPalestras"),
    minicurso: formData.get("minicurso"),
    assuntoMinicurso: formData.get("assuntoMinicurso"),
  };

  try {
    const docRef = await db.collection("feedbacks").add(feedback);
    return json({ success: true, docId: docRef.id });
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    return json({ success: false, error: "Houve um erro ao enviar seu feedback." }, { status: 500 });
  }
};

export default function Feedback() {
  const actionData = useActionData();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Form method="post" className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Feedback da Palestra</h2>

        <FormGroup label="O que você achou da palestra?">
          <EmojiOptions name="opiniao" options={{ "😊": "Gostou", "😐": "Indiferente", "☹️": "Não Gostou" }} />
        </FormGroup>

        <FormGroup label="Como você classificaria o conteúdo?">
          <EmojiOptions name="dificuldade" options={{ "🟢": "Fácil", "🟡": "Normal", "🔴": "Difícil" }} />
        </FormGroup>

        <FormGroup label="Gostaria de outras palestras nesse sentido?">
          <EmojiOptions name="outrasPalestras" options={{ "👍": "Sim", "👎": "Não" }} />
        </FormGroup>

        <FormGroup label="Gostaria de um minicurso prático sobre algum assunto?">
          <EmojiOptions name="minicurso" options={{ "✅": "Sim", "❌": "Não" }} />
        </FormGroup>

        <div className="mb-4">
          <label className="block font-medium mb-1">Se sim, qual assunto você gostaria?</label>
          <input
            type="text"
            name="assuntoMinicurso"
            placeholder="Digite o assunto aqui"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition duration-300"
        >
          Enviar Feedback
        </button>

        {actionData?.success && (
          <p className="text-green-600 text-center mt-4">
            Obrigado pelo seu feedback! Documento ID: {actionData.docId}
          </p>
        )}
        {actionData?.error && (
          <p className="text-red-500 text-center mt-4">{actionData.error}</p>
        )}
      </Form>
    </div>
  );
}


function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

function EmojiOptions({ name, options }) {
  return (
    <div className="flex justify-around text-2xl">
      {Object.entries(options).map(([emoji, value]) => (
        <label
          key={value}
          className="relative cursor-pointer hover:scale-125 transition-transform"
        >
          <input
            type="radio"
            name={name}
            value={value}
            className="peer hidden"
            required
          />
          <span
            className="inline-block peer-checked:ring-2 peer-checked:ring-green-500 
            peer-checked:bg-green-100 rounded-full p-2 transition-all"
          >
            {emoji}
          </span>
        </label>
      ))}
    </div>
  );
}

