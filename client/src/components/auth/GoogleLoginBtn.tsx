"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useAuthContext } from '@/context/AuthContext';

export default function GoogleLoginBtn() {
    const { loginGoogle } = useAuthContext();

    return (
        <div className="flex justify-center w-full">
            <GoogleLogin
                onSuccess={credentialResponse => {
                    if (credentialResponse.credential) {
                        loginGoogle(credentialResponse.credential);
                    }
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
                theme="filled_black"
                shape="pill"
                size="large"
                width="100%"
                text="continue_with"
            />
        </div>
    );
}
