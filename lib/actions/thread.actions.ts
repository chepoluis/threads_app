// Se necesita para hacer operaciones en la DB porque el cliente no deja hacer operaciones
// de ese tipo por el CORS
'use server'; // Es importante para hacer este tipo de operaciones

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import mongoose from 'mongoose';

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
    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    // await User.findOneAndUpdate(
    //   { id: author }, // Buscar por el campo id personalizado
    //   { $push: { threads: createThread._id } },
    //   { new: true } // Devuelve el documento modificado
    // );

    revalidatePath(path); // Update the changes on the client
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of post to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the post that have no parents (top-leve threads)
  // const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
  //   .sort({ createdAt: 'desc' })
  //   .skip(skipAmount)
  //   .limit(pageSize)
  //   // .populate({ path: 'author', model: User }) // error
  //   .populate({
  //     path: 'children',
  //     populate: {
  //       path: 'author',
  //       model: User,
  //       select: '_id name parentId image',
  //     },
  //   });

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author',
      model: User,
    })
    // .populate({
    //   path: 'community',
    //   model: Community,
    // })
    .populate({
      path: 'children', // Populate the children field
      populate: {
        path: 'author', // Populate the author field within children
        model: User,
        select: '_id name parentId image', // Select only _id and username fields of the author
      },
    });

  const totalPostCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postQuery.exec();

  const isNext = totalPostCount > skipAmount + posts.length;

  return {
    posts,
    isNext,
  };
}
