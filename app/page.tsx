import { db } from '../src/lib/firebase';
import { collection } from 'firebase/firestore';

export default function Home() {
  console.log('Firestore conectado:', db);
  
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Flor de Sal</h1>
      <p className="text-sm text-gray-600">Home/Dashboard</p>
    </main>
  );
}
