import { Edit, MessageSquarePlus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addRecruiterNote,
  deleteRecruiterNote,
  updateRecruiterNote
} from "../../features/candidates/candidateSlice.js";
import { formatDate } from "../../utils/formatDate.js";
import Button from "../common/Button.jsx";

const RecruiterNotes = ({ candidate }) => {
  const dispatch = useDispatch();
  const { notesLoading } = useSelector((state) => state.candidates);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const notes = candidate?.recruiterNotes || [];

  const submit = async () => {
    try {
      await dispatch(addRecruiterNote({ id: candidate.id, text })).unwrap();
      setText("");
      toast.success("Note added");
    } catch (error) {
      toast.error(error || "Unable to add note");
    }
  };

  const submitEdit = async (noteId) => {
    try {
      await dispatch(updateRecruiterNote({ id: candidate.id, noteId, text: editingText })).unwrap();
      setEditingId(null);
      setEditingText("");
      toast.success("Note updated");
    } catch (error) {
      toast.error(error || "Unable to update note");
    }
  };

  const remove = async (noteId) => {
    if (!window.confirm("Delete this recruiter note?")) return;
    try {
      await dispatch(deleteRecruiterNote({ id: candidate.id, noteId })).unwrap();
      toast.success("Note deleted");
    } catch (error) {
      toast.error(error || "Unable to delete note");
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Recruiter notes</h3>
          <p className="mt-1 text-sm text-slate-500">Private notes visible only to authorized HR users in this company.</p>
        </div>
        <MessageSquarePlus className="h-5 w-5 text-blue-600" />
      </div>

      <div className="mt-4">
        <textarea
          value={text}
          maxLength={3000}
          onChange={(event) => setText(event.target.value)}
          className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Add recruiter note"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500">{text.length}/3000</span>
          <Button size="sm" loading={notesLoading} disabled={!text.trim()} onClick={submit}>Add note</Button>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {notes.length ? notes.map((note) => {
          const noteId = note.id || note._id;
          const edited = note.edited || (note.createdAt && note.updatedAt && new Date(note.updatedAt).getTime() > new Date(note.createdAt).getTime());
          return (
            <article key={noteId} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              {editingId === noteId ? (
                <>
                  <textarea
                    value={editingText}
                    maxLength={3000}
                    onChange={(event) => setEditingText(event.target.value)}
                    className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="mt-2 flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="outline" icon={X} onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button size="sm" loading={notesLoading} disabled={!editingText.trim()} onClick={() => submitEdit(noteId)}>Save</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.text}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-500">
                      {note.createdByName || "Recruiter"} - {formatDate(note.createdAt, { hour: "2-digit", minute: "2-digit" })}
                      {edited ? " - edited" : ""}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" icon={Edit} onClick={() => { setEditingId(noteId); setEditingText(note.text); }}>Edit</Button>
                      <Button size="sm" variant="danger" icon={Trash2} loading={notesLoading} onClick={() => remove(noteId)}>Delete</Button>
                    </div>
                  </div>
                </>
              )}
            </article>
          );
        }) : <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm font-semibold text-slate-500">No recruiter notes yet.</p>}
      </div>
    </section>
  );
};

export default RecruiterNotes;
