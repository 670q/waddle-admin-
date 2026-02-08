import { useEffect } from 'react'
import { supabase } from './lib/supabase' // Your supabase client path

export function useRealtimeChallenges() {
    useEffect(() => {
        // Listen for changes in the 'challenges' table
        const subscription = supabase
            .channel('public:challenges')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'challenges' },
                (payload) => {
                    console.log('Change received!', payload)
                    // Here you would reload your challenges list
                    // fetchChallenges()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [])
}
