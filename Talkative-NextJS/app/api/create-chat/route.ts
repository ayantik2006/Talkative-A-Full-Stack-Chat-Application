import getUserEmail from "@/lib/getUserEmail";
import Chat from "@/models/Chat";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {chatId, content}=await req.json();

    const now=new Date();
    const date=`${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
    let time;
    if(now.getHours()===0){
        time="12";
    }
    else if(now.getHours()>=13 && now.getHours()<=23){
        time=String(now.getHours()-12);
    }
    else{
        time=String(now.getHours());
    }
    time+=":";
    time+=String(now.getMinutes());
    if(now.getHours()>=0 && now.getHours()<=12){
        time+="am";
    }
    else time+="pm";

    const email=await getUserEmail();
    const userData=await User.findOne({email:email});
    const chatObjectData={
        content:content,
        time:`${time} ${date}`,
        authorName:userData?.name,
        authorId:userData?._id
    }
    await Chat.updateOne({_id:chatId},{$push:{chats:chatObjectData}})
    const chatData=await Chat.findOne({_id:chatId});
    const chats=chatData?.chats;
    return NextResponse.json({chats:chats});
}