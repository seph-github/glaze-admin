import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("User " + user);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;
  const isDefault = formData.get("is_default") === "true";

  if (!file) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const filePath = `${user.id}/${formattedDate}/${Date.now()}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("donut-images")
    .upload(filePath, buffer);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("donut-images").getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("donuts").insert([
    {
      name,
      description,
      image_url: publicUrl,
      is_default: isDefault,
      created_by: user.id,
    },
  ]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
