// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

// const RegisterForm: React.FC = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const error: string | null = null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: implement register logic when backend is ready
//   };

//   return (
//     <div className="w-full max-w-sm flex flex-col gap-8">
//       <div className="flex flex-col gap-1">
//         <h2 className="text-2xl font-bold text-gray-900">Skapa konto</h2>
//         <p className="text-sm text-gray-500">
//           Fyll i dina uppgifter för att komma igång.
//         </p>
//       </div>

//       {error && (
//         <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-col gap-5">
//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-gray-700">Namn</label>
//           <div className="relative">
//             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="För- och efternamn"
//               className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-gray-700">E-post</label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="namn@itm8.com"
//               className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-gray-700">Lösenord</label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//             >
//               {showPassword ? (
//                 <EyeOff className="w-4 h-4" />
//               ) : (
//                 <Eye className="w-4 h-4" />
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="flex flex-col gap-1.5">
//           <label className="text-sm font-medium text-gray-700">
//             Bekräfta lösenord
//           </label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type={showConfirm ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//               className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirm((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//             >
//               {showConfirm ? (
//                 <EyeOff className="w-4 h-4" />
//               ) : (
//                 <Eye className="w-4 h-4" />
//               )}
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-sm bg-purple-600"
//         >
//           Skapa konto
//         </button>
//       </div>

//       <p className="text-center text-sm text-gray-500">
//         Har du redan ett konto?{" "}
//         <Link
//           to="/login"
//           className="font-semibold text-purple-600 hover:text-purple-700 transition"
//         >
//           Logga in
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default RegisterForm;
