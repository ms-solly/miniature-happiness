"use server";

import * as z from "zod";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { postPublishSchema } from "@/lib/validation/post";

export async function CreatePost(context: z.infer<typeof postPublishSchema>) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const post = postPublishSchema.parse(context);

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: post.title,
        content: post.content,
        published: post.published,
        user_id: post.user_id,
      })
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Schema Validation or Other Error:", error);
    return null;
  }
}

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
      console.error("Supabase Error:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Schema Validation or Other Error:", error);
    return null;
  }
}
