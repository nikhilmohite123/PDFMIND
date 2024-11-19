import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = "https://honorable-zebra-671.convex.cloud/api/storage/42a35f5a-ac70-4fcb-a942-3a3b29f24668";
export async function GET(req) {
    const reqUrl=req.url;
    const {searchParams}=new URL(reqUrl)
    const pdfUrl=searchParams.get('pdfUrl');
    const responce = await fetch(pdfUrl);
    const data = await responce.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = '';
    docs.forEach((doc) => {
        pdfTextContent += doc.pageContent
    })
    // split the text into smaller chunk
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
    })
    const output = await splitter.createDocuments([pdfTextContent]);
    const splitterList=[];

    output.forEach(doc=>{
        splitterList.push(doc.pageContent)
    })

    return NextResponse.json({ result: splitterList })
}