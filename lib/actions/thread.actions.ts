// Se necesita para hacer operaciones en la DB porque el cliente no deja hacer operaciones
// de ese tipo por el CORS
'use server'; // Es importante para hacer este tipo de operaciones

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createThread = await Thread.create({
      text,
      author,
      community: null,
    });
  
    // Update user model
    // await User.findByIdAndUpdate(author, {
    //   $push: { threads: createThread._id },
    // });
    
    await User.findOneAndUpdate(
      { id: author }, // Buscar por el campo id personalizado
      { $push: { threads: createThread._id } },
      { new: true } // Devuelve el documento modificado
    );
  
    revalidatePath(path); // Update the changes on the client
  } catch(error: any) {
    throw new Error(`Error creating thread: ${error.message}`)
  }
}
