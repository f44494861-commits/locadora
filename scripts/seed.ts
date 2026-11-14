/**
 * Seed inicial do MVP.
 * Etapa 1: cria ADMIN + categorias.
 * Etapas seguintes expandem clientes, estoque e locações.
 *
 * Pré-requisito: emuladores Auth + Firestore rodando.
 */
import "./load-env";
import { getAdminAuth, getAdminDb } from "../src/lib/firebase/admin";

const CATEGORIAS = [
  "Betoneira",
  "Andaime",
  "Escoramento",
  "Rompedor",
  "Compactador de solo",
  "Lixadeira",
];

async function ensureAdmin() {
  process.env.FIREBASE_PROJECT_ID ||=
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-locadora";

  const email = "admin@locadora.com";
  const password = "Admin@123";
  const nome = "Administrador";
  const auth = getAdminAuth();
  const db = getAdminDb();

  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({
      email,
      password,
      displayName: nome,
      emailVerified: true,
    });
  }

  await auth.setCustomUserClaims(user.uid, { perfil: "ADMIN" });

  const now = new Date();
  await db.collection("users").doc(user.uid).set(
    {
      nome,
      email,
      perfil: "ADMIN",
      ativo: true,
      createdAt: now,
      updatedAt: now,
      createdBy: user.uid,
    },
    { merge: true }
  );

  return user.uid;
}

async function seedCategorias(adminUid: string) {
  const db = getAdminDb();
  const now = new Date();
  const existing = await db.collection("categorias").get();
  if (!existing.empty) {
    console.log("Categorias já existem — pulando.");
    return;
  }

  const batch = db.batch();
  for (const nome of CATEGORIAS) {
    const ref = db.collection("categorias").doc();
    batch.set(ref, {
      nome,
      createdAt: now,
      updatedAt: now,
      createdBy: adminUid,
    });
  }
  await batch.commit();
  console.log(`${CATEGORIAS.length} categorias criadas.`);
}

async function ensureContador() {
  const db = getAdminDb();
  const ref = db.collection("contadores").doc("locacao");
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({ ultimo: 0 });
    console.log("Contador de locação inicializado.");
  }
}

async function main() {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.warn(
      "FIRESTORE_EMULATOR_HOST não definido. Preferível rodar contra o emulador."
    );
  }

  const adminUid = await ensureAdmin();
  console.log(`ADMIN ok (${adminUid})`);
  await seedCategorias(adminUid);
  await ensureContador();
  console.log("Seed etapa 1 concluído.");
  console.log("Credenciais: admin@locadora.com / Admin@123");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
