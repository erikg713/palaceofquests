import { npcs } from '../data/npcs';
import NPCDialog from '../components/NPCDialog';

export default function NPCPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🧙 NPCs</h1>
      {npcs.map((npc) => (
        <div key={npc.id} className="mb-6">
          <NPCDialog npc={npc} />
        </div>
      ))}
    </div>
  );
}