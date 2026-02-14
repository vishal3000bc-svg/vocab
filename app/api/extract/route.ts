import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import { parse } from 'path';
import Jimp from 'jimp';
import { createReadStream } from 'fs';
import { Document, Packer, Paragraph } from 'docx';

// Helper function to read PDF files
const extractFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    return await pdfParse(dataBuffer);
};

// Helper function to read DOC/DOCX files
const extractFromDOCX = async (filePath) => {
    // Implement logic to read DOC/DOCX files, use appropriate library
};

// Helper function to read images
const extractFromImage = async (filePath) => {
    const image = await Jimp.read(filePath);
    const text = await image.get OCR Text(); // Assuming OCR utility function to extract text from images
    return text;
};

// Main handler function
export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files');
        const texts = [];

        for (const file of files) {
            const fileType = file.type;
            const filePath = `./uploads/${file.name}`;
            const reader = createReadStream(filePath);
            reader.pipe(fs.createWriteStream(`./uploads/${file.name}`));

            if (fileType === 'application/pdf') {
                const result = await extractFromPDF(filePath);
                texts.push(result.text);
            } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
                const result = await extractFromDOCX(filePath);
                texts.push(result);
            } else if (fileType.startsWith('image/')) {
                const result = await extractFromImage(filePath);
                texts.push(result);
            } else {
                throw new Error('Unsupported file type');
            }
        }

        return NextResponse.json({ texts });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}