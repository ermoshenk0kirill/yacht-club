import {supabase} from '../../lib/supabase';

export const subscribeNotifications = () => {
  return supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications'
    }, payload => {
      console.log('Notification:', payload)
    })
    .subscribe()
}
