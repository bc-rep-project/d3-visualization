// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// type IParams = {
//   owner: string;
//   repoName: string;
//  } & Record<string, string | undefined>;
 

// const RepoInput: React.FC = () => {
//   const { owner, repoName } = useParams<IParams>();
//   const [loading, setLoading] = useState(false);

//   const fetchRepoData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const repoData = await response.json();
//       // Extract nodes (contributors) and links (followers)
//       const nodes = repoData.contributors.map((contributor: any) => ({
//         id: contributor.login,
//         group: 1,
//         size: contributor.contributions,
//       }));

//       const links = repoData.contributors.flatMap(contributor =>
//         contributor.followers.map((follower: any) => ({
//           source: contributor.login,
//           target: follower.login,
//         }))
//       );

//       // Set the state
//       // setNodes(nodes);
//       // setLinks(links);
//       const [nodes, setNodes] = useState<INode[]>([]);
//       const [links, setLinks] = useState<ILink[]>([]);
      
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRepoData();
//   }, []);

//   return (
//     <div>
//       {loading ? null : <p>Please enter a GitHub URL to start visualizing...</p>}
//     </div>
//   );
// };

// export default RepoInput;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// type IParams = {
//   owner: string;
//   repoName: string;
// } & Record<string, string | undefined>;

// // Define or import these types
// type INode = any; // replace 'any' with the actual type
// type ILink = any; // replace 'any' with the actual type

// const RepoInput: React.FC = () => {
//   const { owner, repoName } = useParams<IParams>();
//   const [loading, setLoading] = useState(false);
//   const [nodes, setNodes] = useState<INode[]>([]);
//   const [links, setLinks] = useState<ILink[]>([]);

//   const fetchRepoData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const repoData = await response.json();
//       // Extract nodes (contributors) and links (followers)
//       const newNodes = repoData.contributors.map((contributor: any) => ({
//         id: contributor.login,
//         group: 1,
//         size: contributor.contributions,
//       }));

//       const newLinks = repoData.contributors.flatMap((contributor: any) =>
//         contributor.followers.map((follower: any) => ({
//           source: contributor.login,
//           target: follower.login,
//         }))
//       );

//       // Set the state
//       setNodes(newNodes);
//       setLinks(newLinks);
      
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRepoData();
//   }, []);

//   return (
//     <div>
//       {loading ? null : <p>Please enter a GitHub URL to start visualizing...</p>}
//     </div>
//   );
// };

// export default RepoInput;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type IParams = {
  owner: string;
  repoName: string;
} & Record<string, string | undefined>;

// Define or import these types
// type INode = any; // replace 'any' with the actual type
// type ILink = any; // replace 'any' with the actual type

type INode = {
  id: string;
  group: number;
  size: number;
};

type ILink = {
  source: string;
  target: string;
};

const RepoInput: React.FC = () => {
  const { owner, repoName } = useParams<IParams>();
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<INode[]>([]);
  const [links, setLinks] = useState<ILink[]>([]);
  const [url, setUrl] = useState<string>('');

  const fetchRepoData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const repoData = await response.json();
      console.log('repoData', repoData);
      // Extract nodes (contributors) and links (followers)
      const newNodes = repoData.contributors.map((contributor: any) => ({
        id: contributor.login,
        group: 1,
        size: contributor.contributions,
      }));

      const newLinks = repoData.contributors.flatMap((contributor: any) =>
        contributor.followers.map((follower: any) => ({
          source: contributor.login,
          target: follower.login,
        }))
      );

      // Set the state
      setNodes(newNodes);
      setLinks(newLinks);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (url !== '') {
      fetchRepoData();
    }
  }, [url]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchRepoData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter a GitHub URL..."
        />
        <button type="submit">Visualize</button>
      </form>
      {loading ? null : <p>Please enter a GitHub URL to start visualizing...</p>}
    </div>
  );
};

export default RepoInput;