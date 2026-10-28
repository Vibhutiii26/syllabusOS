'use client';
import { SignInButton, SignUpButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { LogIn, UserPlus, LogOut } from 'lucide-react';
export default function ClerkAuthControls({mode,onState}:{mode:'user'|'signin'|'signup'|'signout';onState:(state:{isLoaded:boolean;isSignedIn:boolean;userName:string|null})=>void}){
 const {isLoaded,isSignedIn,user}=useUser();
 useEffect(()=>onState({isLoaded,isSignedIn:!!isSignedIn,userName:user?.firstName||user?.primaryEmailAddress?.emailAddress?.split('@')[0]||null}),[isLoaded,isSignedIn,user,onState]);
 if(mode==='user')return <UserButton/>;
 if(mode==='signout')return <SignOutButton><button title="Log out" className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition"><LogOut className="w-4 h-4"/></button></SignOutButton>;
 if(mode==='signin')return <SignInButton mode="modal"><button className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition inline-flex items-center gap-1.5"><LogIn className="w-3.5 h-3.5"/>Sign In</button></SignInButton>;
 return <SignUpButton mode="modal"><button className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-sm"><UserPlus className="w-3.5 h-3.5 text-indigo-300"/>Sign Up</button></SignUpButton>;
}
