export default function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
