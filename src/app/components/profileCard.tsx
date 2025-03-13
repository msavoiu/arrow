import React from "react";
import Link from "next/link";
import Image from "next/image";

type TagObj = {
    id: number;
    tag: { id: number; tagName: string }
};

function ProfileCard({ displayName, username, bio, tags }: { displayName: string , username: string, bio: string, tags: TagObj[] }) {
  return (
    <div>
        <h1>{displayName}</h1>
        <h2>@{username}</h2>
        <p>{bio}</p>

        <ul>
            {tags.map(((tagObj, index) => (
                <li key={index}>{tagObj.tag.tagName}</li>
            )))}
        </ul>
        <div>
            <Link href={"https://instagram.com/" + username}>
                <Image src="/instagram.png" width={30} height={30} alt="Instagram icon"/>
            </Link>
            <Link href={"https://x.com/" + username}>
                <Image src="/x.png" width={30} height={30} alt="X icon"/>
            </Link>
            <Link href={"https://" + username + ".tumblr.com/"}>
                <Image src="/tumblr.png" width={30} height={30} alt="Tumblr icon"/>
            </Link>
        </div>
    </div>
  );
}

export default ProfileCard;