'use client';

import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Image } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function Dashboard() {
  const { user } = useUser();

  // Fetch user's files
  const fileList = useQuery(api.fileStorage.getUserFile, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  // Placeholder component
  const Placeholder = () => (
    <div className="bg-slate-200 rounded-md h-[150px] animate-pulse"></div>
  );

  return (
    <div>
      <h2 className="font-medium text-3xl mb-5">Workspace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {fileList ? (
          fileList.length > 0 ? (
            fileList.map((file, index) => (
              <Link href={`/workspace/${file.fileId}`} key={index}>
                <div className="flex p-5 rounded-md flex-col shadow-md items-center justify-center border cursor-pointer hover:scale-105 transition-transform">
                  <Image src="/pdf.png" alt={`File: ${file?.fileName}`} width={50} height={50} />
                  <h2 className="mt-3 font-medium text-xl">{file?.fileName}</h2>
                </div>
              </Link>
            ))
          ) : (
            <p>No files available. Upload your first file!</p>
          )
        ) : (
          // Loading placeholders
          Array.from({ length: 7 }).map((_, index) => <Placeholder key={index} />)
        )}
      </div>
    </div>
  );
}

export default Dashboard;
