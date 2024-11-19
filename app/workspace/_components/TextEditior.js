import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import EditiorExtention from './EditiorExtention';
import TextAlign from '@tiptap/extension-text-align'; 
import Highlight from '@tiptap/extension-highlight'; 
import Underline from '@tiptap/extension-underline'; 
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function TextEditor({fileId}) {
    const notes=useQuery(api.notes.GetNotes,{
        fileId:fileId
    })
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({ // Configure TextAlign extension
                types: ['heading', 'paragraph'], // Define which node types you want to align
              }),
            Placeholder.configure({
                placeholder: "Start taking your notes here ..."
            }),
            Highlight.configure({ // Configure Highlight extension
                multicolor: true, // Enable multicolor support
              }),
              Underline
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none h-screen p-5'
            }
        }
    });
    // store the notes
    
    useEffect(()=>{
        editor && editor.commands.setContent(notes);
    },[notes])
    return (
        <div>
           <EditiorExtention editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
