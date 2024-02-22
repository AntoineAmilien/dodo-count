import { NextRequest } from "next/server"

import * as mongoDB from "mongodb";
const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb+srv://antoineamilien:kBQmqf58w9FcYElc@cluster0.ppdpgxv.mongodb.net/?retryWrites=true&w=majority");
const db: mongoDB.Db = client.db("dodo-count");


export async function GET(req: NextRequest) {
    const dateRetrouvailles = await db.collection("dateRetrouvaille").find().sort({ _id: -1 }).toArray();
    return Response.json({ dateRetrouvailles: dateRetrouvailles })
}

export async function POST(req: NextRequest) {
    const json = await req.json();
    const { newDate } = json;

    await db.collection("dateRetrouvaille").deleteMany()
    await db.collection("dateRetrouvaille").insertOne({ debut: newDate })
    const dateRetrouvaille = await db.collection("dateRetrouvaille").find().toArray();

    return Response.json({ dateRetrouvaille: dateRetrouvaille[0] })
}