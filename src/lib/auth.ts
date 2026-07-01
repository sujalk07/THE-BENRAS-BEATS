    import { supabase } from "./supabase";

    export async function signUp(
    fullName: string,
    email: string,
    password: string
    ) {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
            full_name: fullName,
        },
        },
    });
    }


    export async function login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
    }

    export async function logout() {
    return await supabase.auth.signOut();
    }