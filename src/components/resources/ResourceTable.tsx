// import React, { useState, useRef, useEffect } from "react";
// import { MoreVertical } from "lucide-react";

// export interface Resource {
//   id: number;
//   name: string;
//   role: string;
//   ongoingProjects: number;
//   capacity: number;
// }

// interface ResourceTableProps {
//   resources: Resource[];
//   onEdit?: (resource: Resource) => void;
//   onDelete?: (resource: Resource) => void;
// }

// const ResourceTable: React.FC<ResourceTableProps> = ({
//   resources,
//   onEdit,
//   onDelete,
// }) => {
//   const [openMenuId, setOpenMenuId] = useState<number | null>(null);
//   const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         openMenuId !== null &&
//         menuRefs.current[openMenuId] &&
//         !menuRefs.current[openMenuId]!.contains(event.target as Node)
//       ) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [openMenuId]);

//   return (
//     <div className="overflow-x-auto bg-white rounded-xl shadow">
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-200 text-left text-sm text-gray-600">
//             <th className="p-4">Resurs</th>
//             <th className="p-4">Roll</th>
//             <th className="p-4">Pågående projekt</th>
//             <th className="p-4">Kapacitet</th>
//             <th className="p-4 text-center w-12">
//               <span className="sr-only">Actions</span>
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {resources.map((r) => (
//             <tr
//               key={r.id}
//               className="border-t text-sm hover:bg-purple-50 cursor-pointer transition"
//             >
//               <td className="p-4 font-medium flex items-center gap-2">
//                 <div
//                   className="w-6 h-6 mt-1 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center mr-1  border-white"
//                   title={r.name}
//                 >
//                   {r.name[0]}
//                 </div>
//                 {r.name}
//               </td>

//               <td className="p-4">{r.role}</td>
//               <td className="p-4">{r.ongoingProjects}</td>
//               <td className="p-4">{r.capacity}%</td>
//               <td className="p-4 text-center relative">
//                 <div
//                   ref={(el) => {
//                     menuRefs.current[r.id] = el;
//                   }}
//                   className="inline-block"
//                 >
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setOpenMenuId(openMenuId === r.id ? null : r.id);
//                     }}
//                     className="p-1 rounded-full hover:bg-gray-200 transition"
//                   >
//                     <MoreVertical className="w-5 h-5 text-gray-600" />
//                   </button>

//                   {openMenuId === r.id && (
//                     <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20">
//                       <button
//                         onClick={() => {
//                           setOpenMenuId(null);
//                           onEdit?.(r);
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100"
//                       >
//                         Redigera
//                       </button>
//                       <button
//                         onClick={() => {
//                           setOpenMenuId(null);
//                           onDelete?.(r);
//                         }}
//                         className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                       >
//                         Ta bort
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ResourceTable;
