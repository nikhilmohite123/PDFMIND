"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
// import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { useAction, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import uuid4 from "uuid4"
import { useUser } from "@clerk/nextjs"
import axios  from 'axios'



function UploadPdf({ children ,isMaxFile}) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const AddFileEntry = useMutation(api.fileStorage.AddFileEntryToDb)
    const [file, setFile] = useState();
    const [open,setOpen]=useState(false)
    const getFileUrl=useMutation(api.fileStorage.getFileUrl);
    const [loading, setloading] = useState(false);
    const embbedDocument=useAction(api.myActions.ingest)
    const [fileName, setFileName] = useState();
    const { user } = useUser();
    const onFileSelect = (event) => {
        setFile(event.target.files[0])
    }

    const onUpload = async () => {
        setloading(true);
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();
        console.log(storageId)
        const fileId = uuid4()
        // Step 3: Save the newly allocated storage id to the database
        const fileUrl=await getFileUrl({storageId})
        const resp = await AddFileEntry({
            fileId,
            storageId,
            fileName: fileName ?? 'untileted file',
            fileUrl:fileUrl,
            createdBy: user?.primaryEmailAddress?.emailAddress

        })
        // Api call to fetch pdfprocess data

        const ApiResp=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
        console.log(ApiResp.data.result)
       await embbedDocument({
            splitText:ApiResp.data.result,
            fileId:fileId
        })
        setloading(false);
        setOpen(false)
    }
    return (
        <Dialog open={open}>

            <DialogTrigger asChild>
                <Button onClick={()=>setOpen(true)} className="w-full" disable={isMaxFile?'true':'false'}>+ Upload PDF File</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload pdf file</DialogTitle>
                    <DialogDescription asChild>
                        <div className="">
                            <h2>select a file to Upload</h2>
                            <div className="  mt-5 gap-2 p-3  border">
                                <input type="file" accept="application/pdf"
                                    onChange={(event) => onFileSelect(event)} />
                            </div>
                            <div className="mt-2">
                                <label>File name *</label>
                                <Input placeholder="File name" onChange={(e) => setFileName(e.target.value)} />

                            </div>
                            <div>

                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button onClick={onUpload}  >{
                        loading ? <Loader2Icon className=" animate-spin" /> : 'Upload'
                    }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default UploadPdf