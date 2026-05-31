import { supabase } from './supabase'

export async function uploadImage(file: File, path: string): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession()
  if (!sessionData.session) {
    throw new Error('Você precisa estar logado para enviar imagens.')
  }

  const { error, data: uploadData } = await supabase.storage
    .from('bezzery-media')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) {
    console.error('[uploadImage] Supabase Storage error:', error)
    throw new Error(`Erro no upload: ${error.message}`)
  }

  console.log('[uploadImage] Upload ok:', uploadData)

  const { data } = supabase.storage
    .from('bezzery-media')
    .getPublicUrl(path)

  return data.publicUrl
}
