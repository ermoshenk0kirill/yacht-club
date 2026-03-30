import {supabase} from '../../lib/supabase';

export const uploadFile = async (file: File) => {
  const { data } = await supabase.storage
    .from('documents')
    .upload(`docs/${Date.now()}-${file.name}`, file)

  return data
}
