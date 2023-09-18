import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData, useRouteError } from '@remix-run/react';
import NewNote, {links as newNoteLinks } from '~/components/NewNote';
import NoteList, {links as noteListLinks} from '~/Components/NoteList';
import { getStoredNotes, storeNotes } from '../data/notes';

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes}/ >
    </main>
  )
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
}

export async function action({request}) {
  const formData = await request.formData();
  // const noteData = {
  //   title: formData.get("title"),
  //   content: formData.get("content")
  // }
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim.length < 5 ) {
    return { message: 'Invalid title - must be greater than 5 characters' }
  }
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()]
}


export function ErrorBoundary() {
  const routeError = useRouteError();
  const message = routeError.message || 'Oops! Something went wrong.';
  return (
    <main className="error">
      <h1>An error related to your notes occured!</h1>
      <p>{message}</p>
      <p>Back to <Link to="/">Safety! </Link></p>
    </main>
  )
}
