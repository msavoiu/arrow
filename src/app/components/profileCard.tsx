import React from "react";
import Link from "next/link";

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
            {tags.map((tagObj => (
                <li>{tagObj.tag.tagName}</li>
            )))}
        </ul>
        <div>
            <Link href={"https://instagram.com/" + username}>Instagram</Link>
            <Link href={"https://twitter.com/" + username}>Twitter</Link>
            <Link href={"https://" + username + ".tumblr.com/"}>Tumblr</Link>
        </div>
    </div>
  );
}

export default ProfileCard;