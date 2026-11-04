// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { 
//   LogOut, 
//   Image as ImageIcon, 
//   Sparkles, 
//   ShieldCheck, 
//   Link as LinkIcon,
//   BookMarked,
//   X,
//   CheckCircle2,
//   BookOpen,
//   FolderPlus,
//   ChevronDown,
//   ChevronRight,
//   Book,
//   Bookmark,
//   User as UserIcon,
//   Menu,
//   Trash2,
//   Plus,
//   Edit3,
//   Eye,
//   Search,
//   BookmarkCheck
// } from 'lucide-react';
// import { createClient } from '@/app/lib/supabase/client';
// import { InlineMath, BlockMath } from 'react-katex';

// // KaTeX Content Renderer Helper
// function FormattedMathContent({ content }: { content: string }) {
//   if (!content) return <span className="text-stone-400 italic">Preview will appear here as you type...</span>;

//   const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

//   return (
//     <div className="space-y-4">
//       {parts.map((part, index) => {
//         if (part.startsWith('$$') && part.endsWith('$$')) {
//           const math = part.slice(2, -2);
//           return (
//             <div key={index} className="py-2 overflow-x-auto text-center">
//               <BlockMath math={math} />
//             </div>
//           );
//         } else if (part.startsWith('$') && part.endsWith('$')) {
//           const math = part.slice(1, -1);
//           return <InlineMath key={index} math={math} />;
//         } else {
//           return (
//             <p key={index} className="leading-relaxed whitespace-pre-wrap">
//               {part}
//             </p>
//           );
//         }
//       })}
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<any>(null);
//   const [userRole, setUserRole] = useState<string>('student');
//   const [loading, setLoading] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   // Search & Filter State
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Sidebar Tab State ('contents' vs 'bookmarks')
//   const [sidebarTab, setSidebarTab] = useState<'contents' | 'bookmarks'>('contents');
//   const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

//   // Admin Editing & Publishing States
//   const [editingPostId, setEditingPostId] = useState<string | null>(null);
//   const [chapterMode, setChapterMode] = useState<'existing' | 'new'>('existing');
//   const [selectedExistingChapter, setSelectedExistingChapter] = useState('');
//   const [newChapterName, setNewChapterName] = useState('');
//   const [topicTitle, setTopicTitle] = useState('');
//   const [mathExplanation, setMathExplanation] = useState('');
//   const [bookRef, setBookRef] = useState('');
//   const [sourceLink, setSourceLink] = useState('');
//   const [figureName, setFigureName] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
//   const [isPosting, setIsPosting] = useState(false);
//   const [successMsg, setSuccessMsg] = useState<string | null>(null);

//   // Database posts, Active Chapter, and Accordions
//   const [posts, setPosts] = useState<any[]>([]);
//   const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
//   const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});

//   const router = useRouter();
//   const supabase = createClient();

//   useEffect(() => {
//     async function initDashboard() {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) {
//         router.push('/login');
//         return;
//       }
//       setUser(user);

//       // Load saved bookmarks from localStorage
//       const savedBookmarks = localStorage.getItem(`learnmaths_bookmarks_${user.id}`);
//       if (savedBookmarks) {
//         try {
//           setBookmarkedIds(JSON.parse(savedBookmarks));
//         } catch (e) {
//           console.error(e);
//         }
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', user.id)
//         .single();

//       if (profile) {
//         setUserRole(profile.role);
//       }

//       const { data: dbPosts, error } = await supabase
//         .from('posts')
//         .select('*')
//         .order('created_at', { ascending: true });

//       if (!error && dbPosts && dbPosts.length > 0) {
//         setPosts(dbPosts);
//         const firstChap = dbPosts[0]?.chapter;
//         if (firstChap) {
//           setSelectedChapter(firstChap);
//           setExpandedChapters({ [firstChap]: true });
//           setSelectedExistingChapter(firstChap);
//         }
//       }

//       setLoading(false);
//     }
//     initDashboard();
//   }, [router, supabase]);

//   const toggleBookmark = (postId: string) => {
//     let updated;
//     if (bookmarkedIds.includes(postId)) {
//       updated = bookmarkedIds.filter(id => id !== postId);
//     } else {
//       updated = [...bookmarkedIds, postId];
//     }
//     setBookmarkedIds(updated);
//     if (user) {
//       localStorage.setItem(`learnmaths_bookmarks_${user.id}`, JSON.stringify(updated));
//     }
//   };

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//     router.refresh();
//   };

//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const removeImage = () => {
//     setSelectedFile(null);
//     setImagePreview(null);
//     setExistingImageUrl(null);
//   };

//   const handleEditClick = (post: any) => {
//     setEditingPostId(post.id);
//     setChapterMode('existing');
//     setSelectedExistingChapter(post.chapter || '');
//     setTopicTitle(post.title || '');
//     setMathExplanation(post.content || '');
//     setBookRef(post.book_ref || '');
//     setSourceLink(post.source_link || '');
//     setFigureName(post.figure_name || '');
//     setExistingImageUrl(post.image_url || null);
//     setImagePreview(post.image_url || null);
//     setSelectedFile(null);
//     setSuccessMsg(null);

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const cancelEdit = () => {
//     setEditingPostId(null);
//     setTopicTitle('');
//     setMathExplanation('');
//     setBookRef('');
//     setSourceLink('');
//     setFigureName('');
//     removeImage();
//     setSuccessMsg(null);
//   };

//   const handlePublishOrUpdateTopic = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsPosting(true);
//     setSuccessMsg(null);

//     const targetChapter = chapterMode === 'new' ? newChapterName.trim() : selectedExistingChapter;

//     if (!targetChapter) {
//       alert('Please specify a valid chapter name.');
//       setIsPosting(false);
//       return;
//     }

//     let uploadedImageUrl = existingImageUrl;

//     if (selectedFile) {
//       const fileName = `${Date.now()}-${selectedFile.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from('chapter-images')
//         .upload(fileName, selectedFile);

//       if (uploadError) {
//         alert('Error uploading image: ' + uploadError.message);
//         setIsPosting(false);
//         return;
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from('chapter-images')
//         .getPublicUrl(fileName);

//       uploadedImageUrl = publicUrlData.publicUrl;
//     }

//     const payload = {
//       chapter: targetChapter,
//       title: topicTitle,
//       content: mathExplanation,
//       book_ref: bookRef || null,
//       source_link: sourceLink || null,
//       image_url: uploadedImageUrl,
//       figure_name: figureName || null
//     };

//     if (editingPostId) {
//       const { data, error } = await supabase
//         .from('posts')
//         .update(payload)
//         .eq('id', editingPostId)
//         .select();

//       if (error) {
//         alert('Error updating section: ' + error.message);
//         setIsPosting(false);
//       } else if (data && data.length > 0) {
//         const updatedPosts = posts.map(p => p.id === editingPostId ? data[0] : p);
//         setPosts(updatedPosts);
//         setSelectedChapter(targetChapter);
//         setExpandedChapters(prev => ({ ...prev, [targetChapter]: true }));
//         setIsPosting(false);
//         setSuccessMsg('Section updated successfully!');
//         cancelEdit();
//       }
//     } else {
//       const { data, error } = await supabase
//         .from('posts')
//         .insert([payload])
//         .select();

//       if (error) {
//         alert('Error publishing: ' + error.message);
//         setIsPosting(false);
//       } else if (data && data.length > 0) {
//         const updatedPosts = [...posts, data[0]];
//         setPosts(updatedPosts);
//         setSelectedChapter(targetChapter);
//         setExpandedChapters(prev => ({ ...prev, [targetChapter]: true }));
//         setIsPosting(false);
//         setSuccessMsg('Section published into chapter successfully!');
//         setTopicTitle('');
//         setMathExplanation('');
//         setBookRef('');
//         setSourceLink('');
//         setFigureName('');
//         removeImage();
//         if (chapterMode === 'new') {
//           setNewChapterName('');
//           setChapterMode('existing');
//           setSelectedExistingChapter(targetChapter);
//         }
//       }
//     }
//   };

//   const handleDeleteSection = async (postId: string) => {
//     if (!confirm('Are you sure you want to delete this section permanently?')) return;

//     const { error } = await supabase
//       .from('posts')
//       .delete()
//       .eq('id', postId);

//     if (error) {
//       alert('Error deleting section: ' + error.message);
//     } else {
//       const remainingPosts = posts.filter(p => p.id !== postId);
//       setPosts(remainingPosts);
//       if (remainingPosts.length > 0) {
//         setSelectedChapter(remainingPosts[0]?.chapter || null);
//       } else {
//         setSelectedChapter(null);
//       }
//     }
//   };

//   const toggleChapterAccordion = (chap: string) => {
//     setExpandedChapters(prev => ({ ...prev, [chap]: !prev[chap] }));
//     setSelectedChapter(chap);
//   };

//   // Filtered posts based on search query
//   const filteredPosts = posts && posts.length > 0
//     ? posts.filter(p => 
//         p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p?.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p?.content?.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : [];

//   const chaptersList = filteredPosts && filteredPosts.length > 0 
//     ? Array.from(new Set(filteredPosts.map(p => p?.chapter).filter(Boolean)))
//     : [];

//   const currentChapterPosts = filteredPosts && filteredPosts.length > 0 
//     ? filteredPosts.filter(p => p?.chapter === selectedChapter)
//     : [];

//   const bookmarkedPosts = posts.filter(p => bookmarkedIds.includes(p.id));

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-[#1C1917]">
//         <div className="flex items-center gap-3">
//           <div className="w-7 h-7 rounded-lg bg-[#486851] flex items-center justify-center text-white text-xs font-serif italic font-bold">
//             ∫
//           </div>
//           <span className="text-sm font-semibold text-stone-600 font-serif">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FAF9F5] text-[#1C1917] font-sans flex flex-col">
//       {/* Top Header */}
//       <header className="sticky top-0 z-35 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button 
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-1.5 text-stone-600 hover:bg-stone-200 rounded-lg"
//             >
//               <Menu className="w-5 h-5" />
//             </button>

//             <Link href="/dashboard" className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
//               <div className="w-8 h-8 rounded-lg bg-[#486851] flex items-center justify-center text-white font-serif italic text-xl font-bold leading-none select-none shadow-sm">
//                 ∫
//               </div>
//               <span className="font-serif tracking-wide text-stone-900">LearnMaths</span>
//             </Link>

//             {userRole === 'admin' ? (
//               <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-[#486851] text-xs font-bold rounded-full border border-emerald-200">
//                 <ShieldCheck className="w-3.5 h-3.5" />
//                 Author Editor Mode
//               </span>
//             ) : (
//               <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 text-stone-700 text-xs font-semibold rounded-full">
//                 <BookOpen className="w-3.5 h-3.5 text-[#486851]" />
//                 Reader Edition
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs font-medium text-stone-700">
//               <UserIcon className="w-3.5 h-3.5 text-[#486851]" />
//               <span>{user?.user_metadata?.full_name || user?.email}</span>
//             </div>
//             <button
//               onClick={handleSignOut}
//               className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Sign Out"
//             >
//               <LogOut className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Container Layout */}
//       <div className="max-w-7xl w-full mx-auto px-6 py-10 flex-1 grid md:grid-cols-4 gap-10">
        
//         {/* Left Sidebar: Table of Contents & Saved References Drawer */}
//         <aside className={`md:col-span-1 space-y-6 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
//            {/* <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm sticky top-24 space-y-4 w-[330px] max-w-full">
            
//             {/* Sidebar Navigation Tabs */}
//             <div className="grid grid-cols-2 bg-stone-100 p-1 rounded-xl text-xs font-semibold text-stone-600">
//               <button
//                 onClick={() => setSidebarTab('contents')}
//                 className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'contents' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
//               >
//                 <Book className="w-3.5 h-3.5 text-[#486851]" />
//                 Index
//               </button>
//               <button
//                 onClick={() => setSidebarTab('bookmarks')}
//                 className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'bookmarks' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900'}`}
//               >
//                 <Bookmark className="w-3.5 h-3.5 text-amber-600" />
//                 Saved ({bookmarkedIds.length})
//               </button>
//             </div>

//             {sidebarTab === 'contents' ? (
//               <>
//                 {/* Keyword Search Input */}
//                 <div className="relative">
//                   <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search chapters & theorems..."
//                     className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#486851] outline-none text-stone-800"
//                   />
//                   {searchQuery && (
//                     <button 
//                       onClick={() => setSearchQuery('')}
//                       className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   )}
//                 </div>

//                 {chaptersList.length === 0 ? (
//                   <p className="text-xs text-stone-500 italic py-4 text-center">No matching chapters found.</p>
//                 ) : (
//                   <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
//                     {chaptersList.map((chap, idx) => {
//                       const isExpanded = expandedChapters[chap];
//                       const chapSections = filteredPosts.filter(p => p?.chapter === chap);

//                       return (
//                         <div key={chap} className="space-y-1">
//                           <button
//                             onClick={() => toggleChapterAccordion(chap)}
//                             className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
//                               selectedChapter === chap
//                                 ? 'bg-stone-100 text-stone-900 font-semibold border border-stone-200'
//                                 : 'text-stone-700 hover:bg-stone-50'
//                             }`}
//                           >
//                             <div className="flex items-center gap-2.5 truncate">
//                               <span className="text-xs font-mono text-stone-400">0{idx + 1}</span>
//                               <span className="truncate">{chap}</span>
//                             </div>
//                             {isExpanded ? (
//                               <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
//                             ) : (
//                               <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
//                             )}
//                           </button>

//                           {isExpanded && (
//                             <div className="pl-6 space-y-1 py-1 border-l-2 border-[#486851]/30 ml-3 my-1">
//                               {chapSections.map((sec, secIdx) => (
//                                 <button
//                                   key={sec?.id || secIdx}
//                                   onClick={() => {
//                                     setSelectedChapter(chap);
//                                     setMobileMenuOpen(false);
//                                   }}
//                                   className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-[#486851] hover:bg-stone-50 transition-colors flex items-center gap-2 truncate"
//                                 >
//                                   <span className="font-mono text-stone-400">1.{secIdx + 1}</span>
//                                   <span className="truncate">{sec?.title}</span>
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </>
//             ) : (
//               /* SAVED REFERENCES DRAWER LIST */
//               <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
//                 {bookmarkedPosts.length === 0 ? (
//                   <div className="text-center py-8 text-stone-400 text-xs italic">
//                     <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-600" />
//                     No saved references yet. Click the bookmark ribbon on any section to pin it here!
//                   </div>
//                 ) : (
//                   bookmarkedPosts.map((post) => (
//                     <button
//                       key={post.id}
//                       onClick={() => {
//                         setSelectedChapter(post.chapter);
//                         setSidebarTab('contents');
//                         setMobileMenuOpen(false);
//                       }}
//                       className="w-full text-left p-3 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/60 rounded-xl transition-all space-y-1 group"
//                     >
//                       <div className="flex items-center justify-between text-[10px] font-mono text-amber-800 uppercase font-semibold">
//                         <span className="truncate">{post.chapter}</span>
//                         <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
//                       </div>
//                       <div className="text-xs font-serif font-bold text-stone-900 group-hover:text-amber-900 truncate">
//                         {post.title}
//                       </div>
//                     </button>
//                   ))
//                 )}
//               </div>
//             )}
//           {/* </div> */}
//         </aside>

//         {/* Right Content Area: Author Studio or Book Reading Environment */}
//         <main className="md:col-span-3 space-y-10">

//           {/* ADMIN AUTHOR STUDIO WITH LIVE PLAYGROUND PREVIEW */}
//           {userRole === 'admin' && (
//             <div className={`bg-white border rounded-3xl shadow-sm p-6 md:p-8 space-y-6 transition-colors ${editingPostId ? 'border-amber-300 ring-2 ring-amber-100' : 'border-stone-200'}`}>
//               <div className="flex items-center justify-between pb-4 border-b border-stone-100">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-3 rounded-2xl ${editingPostId ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-[#486851]'}`}>
//                     {editingPostId ? <Edit3 className="w-6 h-6" /> : <FolderPlus className="w-6 h-6" />}
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-serif font-bold text-stone-900">
//                       {editingPostId ? 'Edit Section Content' : 'Author Studio: Add Section'}
//                     </h2>
//                     <p className="text-xs text-stone-500">
//                       Write your mathematical proof with live KaTeX rendering preview below.
//                     </p>
//                   </div>
//                 </div>

//                 {editingPostId && (
//                   <button
//                     type="button"
//                     onClick={cancelEdit}
//                     className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg flex items-center gap-1"
//                   >
//                     <X className="w-3.5 h-3.5" />
//                     Cancel Edit
//                   </button>
//                 )}
//               </div>

//               {successMsg && (
//                 <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2">
//                   <CheckCircle2 className="w-5 h-5 text-[#486851]" />
//                   {successMsg}
//                 </div>
//               )}

//               <form onSubmit={handlePublishOrUpdateTopic} className="space-y-5">
                
//                 {/* Chapter Target Selection */}
//                 <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-3">
//                   <div className="flex items-center justify-between">
//                     <label className="text-xs font-bold uppercase tracking-wider text-stone-700">Target Chapter</label>
//                     <div className="flex items-center gap-2">
//                       <button
//                         type="button"
//                         onClick={() => setChapterMode('existing')}
//                         className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chapterMode === 'existing' ? 'bg-[#486851] text-white' : 'bg-stone-200 text-stone-700'}`}
//                       >
//                         Existing Chapter
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setChapterMode('new')}
//                         className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chapterMode === 'new' ? 'bg-[#486851] text-white' : 'bg-stone-200 text-stone-700'}`}
//                       >
//                         + New Chapter
//                       </button>
//                     </div>
//                   </div>

//                   {chapterMode === 'existing' ? (
//                     chaptersList.length === 0 ? (
//                       <p className="text-xs text-stone-500 italic">No chapters exist yet. Switch to "+ New Chapter" to create your first one.</p>
//                     ) : (
//                       <select
//                         value={selectedExistingChapter}
//                         onChange={(e) => setSelectedExistingChapter(e.target.value)}
//                         className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-[#486851] outline-none"
//                       >
//                         {chaptersList.map(chap => (
//                           <option key={chap} value={chap}>{chap}</option>
//                         ))}
//                       </select>
//                     )
//                   ) : (
//                     <input
//                       type="text"
//                       value={newChapterName}
//                       onChange={(e) => setNewChapterName(e.target.value)}
//                       placeholder="e.g. Chapter 2: Limits & Continuity"
//                       required={chapterMode === 'new'}
//                       className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-[#486851] outline-none"
//                     />
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Section Title</label>
//                   <input
//                     type="text"
//                     value={topicTitle}
//                     onChange={(e) => setTopicTitle(e.target.value)}
//                     placeholder="e.g. 1.1 Function Idea & Mapping"
//                     required
//                     className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#486851] outline-none bg-stone-50/50"
//                   />
//                 </div>

//                 {/* Mathematical Proof Textarea */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Mathematical Proof (KaTeX supported)</label>
//                   <textarea
//                     value={mathExplanation}
//                     onChange={(e) => setMathExplanation(e.target.value)}
//                     placeholder="e.g. Let f(x) be defined as $\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$..."
//                     rows={5}
//                     required
//                     className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-[#486851] outline-none resize-none bg-stone-50/50 leading-relaxed font-mono"
//                   />
//                 </div>

//                 {/* LIVE PLAYGROUND PREVIEW CARD */}
//                 <div className="p-5 bg-[#FAF9F5] border border-emerald-900/10 rounded-2xl space-y-3 shadow-inner">
//                   <div className="flex items-center justify-between text-xs font-mono font-bold text-[#486851] uppercase tracking-wider border-b border-stone-200 pb-2">
//                     <span className="flex items-center gap-1.5">
//                       <Eye className="w-4 h-4" />
//                       Live KaTeX Playground Preview
//                     </span>
//                     <span>Real-Time Render</span>
//                   </div>
//                   <div className="text-stone-800 text-sm md:text-base bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm min-h-[80px]">
//                     <FormattedMathContent content={mathExplanation} />
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
//                       <BookMarked className="w-3.5 h-3.5 text-[#486851]" />
//                       Book Citation
//                     </label>
//                     <input
//                       type="text"
//                       value={bookRef}
//                       onChange={(e) => setBookRef(e.target.value)}
//                       placeholder="e.g. Sullivan Precalculus (9th Ed), p. 112"
//                       className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-stone-50/50"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1.5">
//                       <LinkIcon className="w-3.5 h-3.5 text-[#486851]" />
//                       Reference Source Link
//                     </label>
//                     <input
//                       type="url"
//                       value={sourceLink}
//                       onChange={(e) => setSourceLink(e.target.value)}
//                       placeholder="https://mathworld.wolfram.com/..."
//                       className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-stone-50/50"
//                     />
//                   </div>
//                 </div>

//                 <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-4">
//                   <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
//                     <ImageIcon className="w-4 h-4 text-[#486851]" />
//                     Figure Illustration & Custom Name
//                   </label>

//                   <div className="grid md:grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       value={figureName}
//                       onChange={(e) => setFigureName(e.target.value)}
//                       placeholder="e.g. Figure 1.1: Function mapping representation"
//                       className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-white"
//                     />

//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={handleImageSelect} 
//                       className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-[#486851] cursor-pointer border rounded-xl bg-white" 
//                     />
//                   </div>

//                   {imagePreview && (
//                     <div className="relative inline-block mt-2">
//                       <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border shadow-sm" />
//                       <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full p-1 shadow">
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isPosting}
//                   className={`w-full py-3.5 font-semibold text-white rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 ${editingPostId ? 'bg-amber-800 hover:bg-amber-900' : 'bg-[#486851] hover:bg-[#3b5542]'}`}
//                 >
//                   {editingPostId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                   {isPosting ? 'Saving Changes...' : (editingPostId ? 'Save Section Changes' : 'Publish Section to Chapter')}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* BOOK READING ENVIRONMENT */}
//           <div className="space-y-8">
//             {selectedChapter && (
//               <div className="border-b border-stone-200 pb-6 flex items-center justify-between">
//                 <div>
//                   <div className="flex items-center gap-2 text-xs font-mono text-[#486851] uppercase tracking-widest font-bold mb-2">
//                     <Bookmark className="w-3.5 h-3.5" />
//                     Active Book Module
//                   </div>
//                   <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-stone-900 tracking-tight">
//                     {selectedChapter}
//                   </h1>
//                 </div>
//               </div>
//             )}

//             {currentChapterPosts.length === 0 ? (
//               <div className="bg-white border border-stone-200 rounded-3xl p-16 text-center text-stone-400 font-serif italic">
//                 Select a chapter from the index to begin reading.
//               </div>
//             ) : (
//               currentChapterPosts.map((post, idx) => {
//                 const isBookmarked = bookmarkedIds.includes(post.id);

//                 return (
//                   <article key={post?.id || idx} className="bg-white border border-stone-200/80 rounded-3xl p-8 md:p-12 shadow-sm space-y-6 relative">
                    
//                     {/* Header info, Bookmark, Edit & Delete Buttons */}
//                     <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-stone-400 border-b border-stone-100 pb-4">
//                       <span className="text-stone-700 font-semibold uppercase tracking-wider">{post?.book_ref || 'First-Principles Monograph'}</span>
                      
//                       <div className="flex items-center gap-3">
//                         <span>Section 1.{idx + 1}</span>

//                         {/* Bookmark Button for Everyone */}
//                         <button
//                           onClick={() => toggleBookmark(post.id)}
//                           className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${isBookmarked ? 'bg-amber-100 text-amber-700' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'}`}
//                           title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Section'}
//                         >
//                           <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
//                         </button>

//                         {userRole === 'admin' && (
//                           <div className="flex items-center gap-2 font-sans pl-2 border-l border-stone-200">
//                             <button
//                               onClick={() => handleEditClick(post)}
//                               className="flex items-center gap-1 text-stone-600 hover:text-amber-800 hover:bg-amber-50 px-2.5 py-1 rounded-lg transition-colors"
//                               title="Edit Section"
//                             >
//                               <Edit3 className="w-3.5 h-3.5" />
//                               <span>Edit</span>
//                             </button>
//                             <button
//                               onClick={() => handleDeleteSection(post.id)}
//                               className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors"
//                               title="Delete Section"
//                             >
//                               <Trash2 className="w-3.5 h-3.5" />
//                               <span>Delete</span>
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-tight">
//                       {post?.title}
//                     </h3>
                    
//                     <div className="text-stone-800 text-base md:text-lg leading-relaxed font-sans font-normal space-y-4 pt-2">
//                       <FormattedMathContent content={post?.content} />
//                     </div>

//                     {post?.image_url && (
//                       <figure className="my-8 p-6 bg-stone-50/80 border border-stone-200/60 rounded-2xl text-center space-y-3">
//                         <div className="overflow-hidden rounded-xl bg-white border border-stone-200/50 p-2 shadow-inner inline-block">
//                           <img 
//                             src={post.image_url} 
//                             alt="Mathematical Figure Reference" 
//                             className="max-h-[420px] mx-auto object-contain rounded-lg" 
//                           />
//                         </div>
//                         <figcaption className="text-xs font-serif italic text-stone-600 font-medium">
//                           {post?.figure_name || `Figure 1.${idx + 1}: Geometric representation for ${post?.title}.`}
//                         </figcaption>
//                       </figure>
//                     )}

//                     {post?.source_link && post.source_link !== '#' && (
//                       <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
//                         <a href={post.source_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#486851] hover:underline font-mono">
//                           <LinkIcon className="w-3.5 h-3.5" />
//                           External Reference Link
//                         </a>
//                         <span className="text-xs text-stone-400 font-mono">LearnMaths Press</span>
//                       </div>
//                     )}
//                   </article>
//                 );
//               })
//             )}
//           </div>

//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogOut, 
  Image as ImageIcon, 
  ShieldCheck, 
  Link as LinkIcon,
  BookMarked,
  X,
  CheckCircle2,
  BookOpen,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Book,
  Bookmark,
  Menu,
  Trash2,
  Plus,
  Edit3,
  Eye,
  Search,
  BookmarkCheck,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Activity
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import { InlineMath, BlockMath } from 'react-katex';

// SIMPLE INTERACTIVE GRAPHING CANVAS COMPONENT
function SimpleGrapher() {
  const [expression, setExpression] = useState('x^2 - 4');
  const [bounds, setBounds] = useState({ xMin: -10, xMax: 10, yMin: -8, yMax: 8 });
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const width = 800;
  const height = 400;

  // Evaluate math expression safely
  const evaluateY = (expr: string, xVal: number): number | null => {
    try {
      let sanitized = expr
        .toLowerCase()
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs')
        .replace(/exp/g, 'Math.exp')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
        .replace(/([a-zA-Z0-9_.\(\)]+)\^([a-zA-Z0-9_.\(\)]+)/g, 'Math.pow($1, $2)')
        .replace(/(\d)([a-zA-Z\(])/g, '$1*$2')
        .replace(/(\))(x|\d)/g, '$1*$2')
        .replace(/\bx\b/g, `(${xVal})`);

      const result = Function(`"use strict"; return (${sanitized})`)();
      return typeof result === 'number' && !isNaN(result) && isFinite(result) ? result : null;
    } catch {
      return null;
    }
  };

  // Coordinates mapping
  const toScreenX = (x: number) => ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width;
  const toScreenY = (y: number) => height - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * height;
  const toMathX = (px: number) => bounds.xMin + (px / width) * (bounds.xMax - bounds.xMin);
  const toMathY = (py: number) => bounds.yMin + ((height - py) / height) * (bounds.yMax - bounds.yMin);

  // Generate curve path
  const pathData = useMemo(() => {
    const steps = 300;
    const dx = (bounds.xMax - bounds.xMin) / steps;
    let d = '';
    let drawing = false;

    for (let i = 0; i <= steps; i++) {
      const x = bounds.xMin + i * dx;
      const y = evaluateY(expression, x);

      if (y !== null && y >= bounds.yMin - 10 && y <= bounds.yMax + 10) {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        d += drawing ? ` L ${sx} ${sy}` : `M ${sx} ${sy}`;
        drawing = true;
      } else {
        drawing = false;
      }
    }
    return d;
  }, [expression, bounds]);

  // Grid tick lines
  const gridTicks = useMemo(() => {
    const ticksX = [];
    const ticksY = [];
    for (let x = Math.ceil(bounds.xMin); x <= Math.floor(bounds.xMax); x += 2) {
      if (x !== 0) ticksX.push(x);
    }
    for (let y = Math.ceil(bounds.yMin); y <= Math.floor(bounds.yMax); y += 2) {
      if (y !== 0) ticksY.push(y);
    }
    return { ticksX, ticksY };
  }, [bounds]);

  const handleZoom = (factor: number) => {
    setBounds(p => ({
      xMin: p.xMin * factor,
      xMax: p.xMax * factor,
      yMin: p.yMin * factor,
      yMax: p.yMax * factor
    }));
  };

  return (
    <div className="w-full bg-white dark:bg-[#1A1A1A] border border-stone-200/80 dark:border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 shadow-sm transition-colors">
      
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#486851] dark:text-emerald-400" />
          <h3 className="text-sm font-serif font-bold text-stone-900 dark:text-stone-100">
            Interactive Function Grapher
          </h3>
        </div>
        <span className="text-xs text-stone-400 font-mono">Real-time SVG Plot</span>
      </div>

      {/* Input Bar & Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-2.5">
          <span className="font-serif font-bold text-[#486851] dark:text-emerald-400 text-sm select-none">f(x) =</span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. x^2 - 4 or sin(x)"
            className="w-full bg-transparent outline-none font-mono text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-all cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-all cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBounds({ xMin: -10, xMax: 10, yMin: -8, yMax: 8 })}
            className="p-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition-all cursor-pointer"
            title="Reset Bounds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Clean Coordinate Graph Canvas */}
      <div className="relative w-full bg-[#FAF9F5] dark:bg-[#121212] rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - rect.left) * (width / rect.width);
            const py = (e.clientY - rect.top) * (height / rect.height);
            setHoverPos({ x: toMathX(px), y: toMathY(py) });
          }}
          onMouseLeave={() => setHoverPos(null)}
        >
          {/* Grid lines */}
          <g className="stroke-stone-200 dark:stroke-stone-800/60" strokeWidth="1" strokeDasharray="3,3">
            {gridTicks.ticksX.map(x => (
              <line key={`x-${x}`} x1={toScreenX(x)} y1={0} x2={toScreenX(x)} y2={height} />
            ))}
            {gridTicks.ticksY.map(y => (
              <line key={`y-${y}`} x1={0} y1={toScreenY(y)} x2={width} y2={toScreenY(y)} />
            ))}
          </g>

          {/* Axes */}
          <g className="stroke-stone-400 dark:stroke-stone-600" strokeWidth="2">
            <line x1={0} y1={toScreenY(0)} x2={width} y2={toScreenY(0)} />
            <line x1={toScreenX(0)} y1={0} x2={toScreenX(0)} y2={height} />
          </g>

          {/* Grid Labels */}
          <g className="fill-stone-400 dark:fill-stone-500 text-[10px] font-mono select-none">
            {gridTicks.ticksX.map(x => (
              <text key={`lx-${x}`} x={toScreenX(x)} y={toScreenY(0) + 14} textAnchor="middle">{x}</text>
            ))}
            {gridTicks.ticksY.map(y => (
              <text key={`ly-${y}`} x={toScreenX(0) - 6} y={toScreenY(y) + 3} textAnchor="end">{y}</text>
            ))}
          </g>

          {/* Plot Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#486851"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Point */}
          {hoverPos && (
            <g>
              <circle
                cx={toScreenX(hoverPos.x)}
                cy={toScreenY(evaluateY(expression, hoverPos.x) ?? hoverPos.y)}
                r="5"
                className="fill-[#486851] stroke-white dark:stroke-stone-900"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Coordinates HUD */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 px-3 py-1 rounded-xl text-xs font-mono text-stone-600 dark:text-stone-300">
          {hoverPos ? `(${hoverPos.x.toFixed(2)}, ${(evaluateY(expression, hoverPos.x) ?? hoverPos.y).toFixed(2)})` : 'Hover graph'}
        </div>
      </div>

    </div>
  );
}

// KaTeX Content Renderer Helper
function FormattedMathContent({ content }: { content: string }) {
  if (!content) return <span className="text-stone-400 italic">Preview will appear here as you type...</span>;

  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g);

  return (
    <div className="space-y-4 overflow-x-auto max-w-full">
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          return (
            <div key={index} className="py-2 overflow-x-auto text-center">
              <BlockMath math={math} />
            </div>
          );
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={index} math={math} />;
        } else {
          return (
            <p key={index} className="leading-relaxed whitespace-pre-wrap">
              {part}
            </p>
          );
        }
      })}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme State ('light' vs 'dark')
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sidebar Tab State ('contents' vs 'bookmarks')
  const [sidebarTab, setSidebarTab] = useState<'contents' | 'bookmarks'>('contents');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Admin Editing & Publishing States
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [chapterMode, setChapterMode] = useState<'existing' | 'new'>('existing');
  const [selectedExistingChapter, setSelectedExistingChapter] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [mathExplanation, setMathExplanation] = useState('');
  const [bookRef, setBookRef] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [figureName, setFigureName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Database posts, Active Chapter, and Accordions
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function initDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load theme preference on mount & sync DOM
      const savedTheme = localStorage.getItem('learnmaths_theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }

      // Load saved bookmarks from localStorage
      const savedBookmarks = localStorage.getItem(`learnmaths_bookmarks_${user.id}`);
      if (savedBookmarks) {
        try {
          setBookmarkedIds(JSON.parse(savedBookmarks));
        } catch (e) {
          console.error(e);
        }
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }

      const { data: dbPosts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && dbPosts && dbPosts.length > 0) {
        setPosts(dbPosts);
        const firstChap = dbPosts[0]?.chapter;
        if (firstChap) {
          setSelectedChapter(firstChap);
          setExpandedChapters({ [firstChap]: true });
          setSelectedExistingChapter(firstChap);
        }
      }

      setLoading(false);
    }
    initDashboard();
  }, [router, supabase]);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('learnmaths_theme', 'light');
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('learnmaths_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const toggleBookmark = (postId: string) => {
    let updated;
    if (bookmarkedIds.includes(postId)) {
      updated = bookmarkedIds.filter(id => id !== postId);
    } else {
      updated = [...bookmarkedIds, postId];
    }
    setBookmarkedIds(updated);
    if (user) {
      localStorage.setItem(`learnmaths_bookmarks_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleEditClick = (post: any) => {
    setEditingPostId(post.id);
    setChapterMode('existing');
    setSelectedExistingChapter(post.chapter || '');
    setTopicTitle(post.title || '');
    setMathExplanation(post.content || '');
    setBookRef(post.book_ref || '');
    setSourceLink(post.source_link || '');
    setFigureName(post.figure_name || '');
    setExistingImageUrl(post.image_url || null);
    setImagePreview(post.image_url || null);
    setSelectedFile(null);
    setSuccessMsg(null);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setTopicTitle('');
    setMathExplanation('');
    setBookRef('');
    setSourceLink('');
    setFigureName('');
    removeImage();
    setSuccessMsg(null);
  };

  const handlePublishOrUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    setSuccessMsg(null);

    const targetChapter = chapterMode === 'new' ? newChapterName.trim() : selectedExistingChapter;

    if (!targetChapter) {
      alert('Please specify a valid chapter name.');
      setIsPosting(false);
      return;
    }

    let uploadedImageUrl = existingImageUrl;

    if (selectedFile) {
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('chapter-images')
        .upload(fileName, selectedFile);

      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setIsPosting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('chapter-images')
        .getPublicUrl(fileName);

      uploadedImageUrl = publicUrlData.publicUrl;
    }

    const payload = {
      chapter: targetChapter,
      title: topicTitle,
      content: mathExplanation,
      book_ref: bookRef || null,
      source_link: sourceLink || null,
      image_url: uploadedImageUrl,
      figure_name: figureName || null
    };

    if (editingPostId) {
      const { data, error } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', editingPostId)
        .select();

      if (error) {
        alert('Error updating section: ' + error.message);
        setIsPosting(false);
      } else if (data && data.length > 0) {
        const updatedPosts = posts.map(p => p.id === editingPostId ? data[0] : p);
        setPosts(updatedPosts);
        setSelectedChapter(targetChapter);
        setExpandedChapters(prev => ({ ...prev, [targetChapter]: true }));
        setIsPosting(false);
        setSuccessMsg('Section updated successfully!');
        cancelEdit();
      }
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert([payload])
        .select();

      if (error) {
        alert('Error publishing: ' + error.message);
        setIsPosting(false);
      } else if (data && data.length > 0) {
        const updatedPosts = [...posts, data[0]];
        setPosts(updatedPosts);
        setSelectedChapter(targetChapter);
        setExpandedChapters(prev => ({ ...prev, [targetChapter]: true }));
        setIsPosting(false);
        setSuccessMsg('Section published into chapter successfully!');
        setTopicTitle('');
        setMathExplanation('');
        setBookRef('');
        setSourceLink('');
        setFigureName('');
        removeImage();
        if (chapterMode === 'new') {
          setNewChapterName('');
          setChapterMode('existing');
          setSelectedExistingChapter(targetChapter);
        }
      }
    }
  };

  const handleDeleteSection = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this section permanently?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      alert('Error deleting section: ' + error.message);
    } else {
      const remainingPosts = posts.filter(p => p.id !== postId);
      setPosts(remainingPosts);
      if (remainingPosts.length > 0) {
        setSelectedChapter(remainingPosts[0]?.chapter || null);
      } else {
        setSelectedChapter(null);
      }
    }
  };

  const toggleChapterAccordion = (chap: string) => {
    setExpandedChapters(prev => ({ ...prev, [chap]: !prev[chap] }));
    setSelectedChapter(chap);
  };

  // Filtered posts based on search query
  const filteredPosts = posts && posts.length > 0
    ? posts.filter(p => 
        p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.chapter?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const chaptersList = filteredPosts && filteredPosts.length > 0 
    ? Array.from(new Set(filteredPosts.map(p => p?.chapter).filter(Boolean)))
    : [];

  const currentChapterPosts = filteredPosts && filteredPosts.length > 0 
    ? filteredPosts.filter(p => p?.chapter === selectedChapter)
    : [];

  const bookmarkedPosts = posts.filter(p => bookmarkedIds.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121212] flex items-center justify-center text-[#1C1917] dark:text-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#486851] flex items-center justify-center text-white text-sm font-serif italic font-bold shadow-sm">
            ∫
          </div>
          <span className="text-sm font-semibold font-serif animate-pulse">Loading Study Environment...</span>
        </div>
      </div>
    );
  }

  // Shared Sidebar Content JSX
  const sidebarContent = (
    <div className="bg-white dark:bg-[#1A1A1A] border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 w-full">
      {/* Sidebar Navigation Tabs */}
      <div className="grid grid-cols-2 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400">
        <button
          onClick={() => setSidebarTab('contents')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'contents' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'hover:text-stone-900 dark:hover:text-stone-200'}`}
        >
          <Book className="w-3.5 h-3.5 text-[#486851]" />
          Index
        </button>
        <button
          onClick={() => setSidebarTab('bookmarks')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'bookmarks' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm font-bold' : 'hover:text-stone-900 dark:hover:text-stone-200'}`}
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-600" />
          Saved ({bookmarkedIds.length})
        </button>
      </div>

      {sidebarTab === 'contents' ? (
        <>
          {/* Keyword Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters & theorems..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-[#486851] outline-none text-stone-800 dark:text-stone-200 placeholder-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {chaptersList.length === 0 ? (
            <p className="text-xs text-stone-500 italic py-6 text-center">No matching chapters found.</p>
          ) : (
            <div className="space-y-2 max-h-[calc(100vh-260px)] md:max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {chaptersList.map((chap, idx) => {
                const isExpanded = expandedChapters[chap];
                const chapSections = filteredPosts.filter(p => p?.chapter === chap);

                return (
                  <div key={chap} className="space-y-1">
                    <button
                      onClick={() => toggleChapterAccordion(chap)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between group ${
                        selectedChapter === chap
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold border border-stone-200 dark:border-stone-700'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-xs font-mono text-stone-400">0{idx + 1}</span>
                        <span className="truncate">{chap}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="pl-5 space-y-1 py-1 border-l-2 border-[#486851]/30 ml-3 my-1">
                        {chapSections.map((sec, secIdx) => (
                          <button
                            key={sec?.id || secIdx}
                            onClick={() => {
                              setSelectedChapter(chap);
                              setMobileMenuOpen(false);
                              setTimeout(() => {
                                const element = document.getElementById(`section-${sec?.id}`);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }, 100);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-[#486851] dark:hover:text-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex items-center gap-2 truncate"
                          >
                            <span className="font-mono text-stone-400 shrink-0">1.{secIdx + 1}</span>
                            <span className="truncate">{sec?.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* SAVED REFERENCES DRAWER LIST */
        <div className="space-y-2 max-h-[calc(100vh-260px)] md:max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {bookmarkedPosts.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs italic px-4">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-600" />
              No saved references yet. Click the bookmark ribbon on any section to pin it here!
            </div>
          ) : (
            bookmarkedPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => {
                  setSelectedChapter(post.chapter);
                  setSidebarTab('contents');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    const element = document.getElementById(`section-${post.id}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="w-full text-left p-3 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-800 dark:text-amber-400 uppercase font-semibold">
                  <span className="truncate">{post.chapter}</span>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                </div>
                <div className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-900 truncate">
                  {post.title}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#121212] text-[#1C1917] dark:text-stone-100 font-sans flex flex-col pb-16 md:pb-0 transition-colors">
      
      {/* Top Header - Aligned with max-w-7xl layout */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Menu to X Transformative Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-red-600 transition-transform rotate-90" />
              ) : (
                <Menu className="w-4 h-4 text-[#486851] dark:text-emerald-400 transition-transform" />
              )}
              <span className="xs:inline">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#486851] flex items-center justify-center text-white font-serif italic text-lg sm:text-xl font-bold leading-none select-none shadow-sm">
                ∫
              </div>
              <span className="font-serif tracking-wide text-stone-900 dark:text-stone-100">LearnMaths</span>
            </Link>

            {userRole === 'admin' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-[#486851] dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Author Editor Mode
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-full">
                <BookOpen className="w-3.5 h-3.5 text-[#486851] dark:text-emerald-400" />
                Reader Edition
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Profile Link Button */}
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-full text-xs font-medium transition-all"
              title="Profile Settings"
            >
              <div className="w-5 h-5 rounded-full bg-[#486851] text-white flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user?.user_metadata?.full_name || user?.email}</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative w-[310px] max-w-[85vw] bg-white dark:bg-[#1A1A1A] h-full shadow-2xl p-4 flex flex-col z-10 animate-slide-right">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Navigation Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-10 flex-1 grid md:grid-cols-4 gap-8 md:gap-10">
        
        {/* Left Sidebar: Desktop Sticky Table of Contents */}
        <aside className="hidden md:block md:col-span-1">
          <div className="sticky top-24 w-[280px] lg:w-[310px]">
            {sidebarContent}
          </div>
        </aside>

        {/* Right Content Area: Author Studio or Book Reading Environment */}
        <main className="md:col-span-3 space-y-8 md:space-y-10 min-w-0">

          {/* ADMIN AUTHOR STUDIO WITH LIVE PLAYGROUND PREVIEW */}
          {userRole === 'admin' && (
            <div className={`bg-white dark:bg-[#1A1A1A] border rounded-2xl md:rounded-3xl shadow-sm p-5 sm:p-6 md:p-8 space-y-6 transition-colors ${editingPostId ? 'border-amber-300 dark:border-amber-600 ring-2 ring-amber-100 dark:ring-amber-950/40' : 'border-stone-200 dark:border-stone-800'}`}>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 sm:p-3 rounded-2xl ${editingPostId ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-950/50 text-[#486851] dark:text-emerald-400'}`}>
                    {editingPostId ? <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" /> : <FolderPlus className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                      {editingPostId ? 'Edit Section Content' : 'Author Studio: Add Section'}
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Write your mathematical proof with live KaTeX rendering preview below.
                    </p>
                  </div>
                </div>

                {editingPostId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Edit
                  </button>
                )}
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#486851] dark:text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handlePublishOrUpdateTopic} className="space-y-5">
                
                {/* Chapter Target Selection */}
                <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">Target Chapter</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setChapterMode('existing')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chapterMode === 'existing' ? 'bg-[#486851] text-white shadow-2xs' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}
                      >
                        Existing Chapter
                      </button>
                      <button
                        type="button"
                        onClick={() => setChapterMode('new')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${chapterMode === 'new' ? 'bg-[#486851] text-white shadow-2xs' : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'}`}
                      >
                        + New Chapter
                      </button>
                    </div>
                  </div>

                  {chapterMode === 'existing' ? (
                    chaptersList.length === 0 ? (
                      <p className="text-xs text-stone-500 italic">No chapters exist yet. Switch to "+ New Chapter" to create your first one.</p>
                    ) : (
                      <select
                        value={selectedExistingChapter}
                        onChange={(e) => setSelectedExistingChapter(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#486851] outline-none"
                      >
                        {chaptersList.map(chap => (
                          <option key={chap} value={chap}>{chap}</option>
                        ))}
                      </select>
                    )
                  ) : (
                    <input
                      type="text"
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      placeholder="e.g. Chapter 2: Limits & Continuity"
                      required={chapterMode === 'new'}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-[#486851] outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Section Title</label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="e.g. 1.1 Function Idea & Mapping"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm focus:ring-2 focus:ring-[#486851] outline-none bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                  />
                </div>

                {/* Mathematical Proof Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">Mathematical Proof (KaTeX supported)</label>
                  <textarea
                    value={mathExplanation}
                    onChange={(e) => setMathExplanation(e.target.value)}
                    placeholder="e.g. Let f(x) be defined as $\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$..."
                    rows={6}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm focus:ring-2 focus:ring-[#486851] outline-none resize-none bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 leading-relaxed font-mono"
                  />
                </div>

                {/* LIVE PLAYGROUND PREVIEW CARD */}
                <div className="p-4 sm:p-5 bg-[#FAF9F5] dark:bg-stone-900 border border-emerald-900/10 dark:border-emerald-500/20 rounded-2xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#486851] dark:text-emerald-400 uppercase tracking-wider border-b border-stone-200 dark:border-stone-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      Live KaTeX Playground Preview
                    </span>
                    <span>Real-Time Render</span>
                  </div>
                  <div className="text-stone-800 dark:text-stone-200 text-sm md:text-base bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 shadow-sm min-h-[80px] overflow-x-auto">
                    <FormattedMathContent content={mathExplanation} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-[#486851] dark:text-emerald-400" />
                      Book Citation
                    </label>
                    <input
                      type="text"
                      value={bookRef}
                      onChange={(e) => setBookRef(e.target.value)}
                      placeholder="e.g. Sullivan Precalculus (9th Ed), p. 112"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-[#486851] dark:text-emerald-400" />
                      Reference Source Link
                    </label>
                    <input
                      type="url"
                      value={sourceLink}
                      onChange={(e) => setSourceLink(e.target.value)}
                      placeholder="https://mathworld.wolfram.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-stone-50/50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#486851] dark:text-emerald-400" />
                    Figure Illustration & Custom Name
                  </label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={figureName}
                      onChange={(e) => setFigureName(e.target.value)}
                      placeholder="e.g. Figure 1.1: Function mapping representation"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />

                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                      className="w-full text-xs text-stone-500 dark:text-stone-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 dark:file:bg-emerald-950 file:text-[#486851] dark:file:text-emerald-400 cursor-pointer border dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800" 
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative inline-block mt-2">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border dark:border-stone-700 shadow-sm" />
                      <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full p-1 shadow">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPosting}
                  className={`w-full py-3.5 font-semibold text-white rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 ${editingPostId ? 'bg-amber-800 hover:bg-amber-900' : 'bg-[#486851] hover:bg-[#3b5542]'}`}
                >
                  {editingPostId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isPosting ? 'Saving Changes...' : (editingPostId ? 'Save Section Changes' : 'Publish Section to Chapter')}
                </button>
              </form>
            </div>
          )}

          {/* BOOK READING ENVIRONMENT WITH SIMPLE GRAPHING CANVAS */}
          <div className="space-y-6 md:space-y-8">
            
            {/* LINKED INTERACTIVE GRAPHING CANVAS AT TOP OF READING AREA */}
            <SimpleGrapher />

            {selectedChapter && (
              <div className="border-b border-stone-200 dark:border-stone-800 pb-5 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">{selectedChapter}</h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Showing all published sections for this chapter.</p>
                </div>
              </div>
            )}

            {currentChapterPosts.length === 0 ? (
              <div className="p-10 sm:p-12 text-center bg-white dark:bg-[#1A1A1A] border border-stone-200/80 dark:border-stone-800 rounded-2xl md:rounded-3xl space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-stone-300 dark:text-stone-600" />
                <p className="text-sm font-medium text-stone-600 dark:text-stone-400">No sections found in this chapter.</p>
              </div>
            ) : (
              currentChapterPosts.map((post, idx) => (
                <article 
                  key={post.id} 
                  id={`section-${post.id}`} 
                  className="bg-white dark:bg-[#1A1A1A] border border-stone-200/80 dark:border-stone-800 rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 space-y-5 md:space-y-6 shadow-sm scroll-mt-24 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
                    <span className="text-xs font-mono font-bold text-[#486851] dark:text-emerald-400 uppercase tracking-wider">
                      Section 1.{idx + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`p-2 rounded-xl transition-colors ${bookmarkedIds.includes(post.id) ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900' : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                        title={bookmarkedIds.includes(post.id) ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => handleEditClick(post)}
                            className="p-2 text-stone-500 dark:text-stone-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
                            title="Edit Section"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(post.id)}
                            className="p-2 text-stone-500 dark:text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {post.title}
                  </h2>

                  <div className="text-stone-800 dark:text-stone-200 text-sm md:text-base leading-relaxed overflow-x-auto">
                    <FormattedMathContent content={post.content} />
                  </div>

                  {post.image_url && (
                    <div className="space-y-2 pt-2">
                      <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-2">
                        <img src={post.image_url} alt={post.figure_name || post.title} className="w-full max-h-[350px] sm:max-h-[400px] object-contain mx-auto" />
                      </div>
                      {post.figure_name && (
                        <p className="text-center text-xs font-serif italic text-stone-500 dark:text-stone-400">{post.figure_name}</p>
                      )}
                    </div>
                  )}

                  {(post.book_ref || post.source_link) && (
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
                      {post.book_ref && (
                        <div className="flex items-center gap-1.5 font-medium">
                          <BookMarked className="w-3.5 h-3.5 text-[#486851] dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{post.book_ref}</span>
                        </div>
                      )}

                      {post.source_link && (
                        <a 
                          href={post.source_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 text-[#486851] dark:text-emerald-400 hover:underline font-medium ml-auto"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>External Reference</span>
                        </a>
                      )}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

        </main>
      </div>

      {/* Mobile Floating Quick Jump Bar at Bottom */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-30 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-xl flex items-center justify-between px-5 border border-stone-800">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold hover:text-emerald-400 transition-colors py-1"
        >
          <Menu className="w-4 h-4 text-emerald-400" />
          <span>Chapters Menu</span>
        </button>
        <div className="h-4 w-[1px] bg-stone-700" />
        <button
          onClick={() => {
            setSidebarTab('bookmarks');
            setMobileMenuOpen(true);
          }}
          className="flex items-center gap-2 text-xs font-semibold hover:text-amber-400 transition-colors py-1"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          <span>Saved ({bookmarkedIds.length})</span>
        </button>
      </div>

    </div>
  );
}