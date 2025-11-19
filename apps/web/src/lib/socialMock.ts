"use server";
// Lightweight persistent mock for social features (demo-only)
import fs from 'fs';
import path from 'path';

type Post = {
  id: string;
  authorHandle: string;
  content: string;
  createdAt: string;
}

type Profile = {
  handle: string;
  displayName: string;
  bio?: string;
  followers?: number;
}

type Message = { id: string; from: string; to: string; text: string; createdAt: string };

const now = () => new Date().toISOString();

const DATA_FILE = path.join(process.cwd(), '.web-social-data.json');

let profiles: Profile[] = [];
let posts: Post[] = [];
let messages: Message[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const json = JSON.parse(raw || '{}');
      profiles = json.profiles ?? [];
      posts = json.posts ?? [];
      messages = json.messages ?? [];
      return;
    }
  } catch (err) {
    // ignore and initialize defaults
  }

  // defaults
  profiles = [
    { handle: 'alice', displayName: 'Alice', bio: 'DAO builder & farmer', followers: 324 },
    { handle: 'bob', displayName: 'Bob', bio: 'Solar engineer', followers: 128 },
  ];

  posts = [
    { id: 'p1', authorHandle: 'alice', content: 'Excited to start Helios#Baghpat pilot! 🌱☀️', createdAt: now() },
    { id: 'p2', authorHandle: 'bob', content: 'Installed first microinverter today — looks good.', createdAt: now() },
  ];

  messages = [
    { id: 'm1', from: 'alice', to: 'bob', text: 'Congrats on the install!', createdAt: now() },
  ];

  persist();
}

function persist() {
  try {
    const json = { profiles, posts, messages };
    fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2), 'utf8');
  } catch (err) {
    // ignore persistence failures in dev
  }
}

loadData();

export function getFeed() {
  return posts.slice().sort((a,b)=> b.createdAt.localeCompare(a.createdAt));
}

export function getProfile(handle: string) {
  return profiles.find(p=>p.handle===handle) ?? null;
}

export function getAllProfiles() {
  return profiles.slice();
}

export function addPost(authorHandle: string, content: string) {
  const p: Post = { id: `p${Date.now()}`, authorHandle, content, createdAt: now() };
  posts.unshift(p);
  persist();
  return p;
}

export function getMessagesFor(user: string) {
  return messages.filter(m => m.from === user || m.to === user).sort((a,b)=> a.createdAt.localeCompare(b.createdAt));
}

export function addMessage(from: string, to: string, text: string) {
  const m: Message = { id: `m${Date.now()}`, from, to, text, createdAt: now() };
  messages.push(m);
  persist();
  return m;
}
