import { useState } from "react";
import PiPaymentButton from "./PiPaymentButton"; // Custom component from your Pi SDK integration

export default function NPCDialog({ npc }) {
  const [state, setState] = useState("greeting");
  const [paid, setPaid] = useState(false);

  const branch = npc.dialogTree.branches?.[state];

  return (
    <div className="bg-gray-800 p-6 rounded-2xl text-white max-w-xl shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <img src={npc.avatar} alt="npc" className="w-16 h-16 rounded-full" />
        <h2 className="text-xl font-bold">{npc.name}</h2>
      </div>
      <p className="mb-4">{branch?.text || npc.dialogTree.greeting}</p>

      {state === "greeting" &&
        npc.dialogTree.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setState(opt.next)}
            className="block w-full text-left bg-purple-700 hover:bg-purple-600 rounded px-4 py-2 mb-2"
          >
            {opt.text}
          </button>
        ))}

      {branch?.actions?.[0]?.type === "pi_payment" && !paid && (
        <PiPaymentButton
          amount={branch.actions[0].amount}
          memo={branch.actions[0].memo}
          metadata={branch.actions[0].metadata}
          onPaymentComplete={() => {
            setPaid(true);
            setState(branch.actions[0].onSuccess);
          }}
        />
      )}

      {paid && branch.actions?.[0]?.onSuccess && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 rounded"
          onClick={() => setState(branch.actions[0].onSuccess)}
        >
          Continue
        </button>
      )}
    </div>
  );
}
