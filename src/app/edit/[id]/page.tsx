import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import authOptions from '@/app/lib/authOptions';
import { loggedInProtectedPage } from '@/app/lib/page-protection';
import { prisma } from '@/app/lib/prisma';
import EditStuffForm from '@/components/EditStuffForm';
import Role from '@/types/prisma';

export default async function EditStuffPage({ params }: { params: { id: string | string[] } }) {
  // Protect the page, only logged in users can access it.
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; role: Role };
      // eslint-disable-next-line @typescript-eslint/comma-dangle
    } | null,
  );
  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);
  // console.log(id);
  const stuff: Stuff | null = await prisma.stuff.findUnique({
    where: { id },
  });
  // console.log(stuff);
  if (!stuff) {
    return notFound();
  }

  return (
    <main>
      <EditStuffForm stuff={stuff} />
    </main>
  );
}
