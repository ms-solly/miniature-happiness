"use server";

import * as z from "zod";
import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { postPublishSchema } from "@/lib/validation/post";

export async function PublishPost(context: z.infer<typeof postPublishSchema>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const post = postPublishSchema.parse(context);

    const { data, error } = await supabase
      .from("posts")
      .update({
        published: post.published,
      })
      .match({ id: post.id })
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}