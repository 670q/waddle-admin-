import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedAdmin() {
    const email = 'anasm5048@gmail.com'
    const password = 'Aa0541262433'

    console.log(`Checking for user: ${email}...`)

    // 1. Check if user exists
    // We can't select * from auth.users easily via client, but listUsers works
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        return
    }

    let user = users.find(u => u.email === email)

    if (user) {
        console.log('User exists. Updating password...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password: password,
            email_confirm: true
        })
        if (updateError) {
            console.error('Error updating password:', updateError)
            return
        }
        console.log('Password updated.')
    } else {
        console.log('User does not exist. Creating...')
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })
        if (createError) {
            console.error('Error creating user:', createError)
            return
        }
        user = newUser.user
        console.log('User created.')
    }

    if (!user) {
        console.error('Failed to get user ID')
        return
    }

    // 2. Assign Admin Role
    console.log(`Assigning super_admin role to ${user.id}...`)

    const { error: dbError } = await supabase
        .from('admins')
        .upsert({
            id: user.id,
            role: 'super_admin'
        })

    if (dbError) {
        console.error('Error assigning role:', dbError)
    } else {
        console.log('Success! User is now a Super Admin.')
    }
}

seedAdmin()
