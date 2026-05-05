import { z } from "zod";

const heroImage = "/img/pics/L+S.JPG";
const photoOne = "/img/pics/1.JPG";
const photoTwo = "/img/pics/2.JPG";
const photoThree = "/img/pics/3.jpg";

const TributeSchema = z.object({
  honoree: z.string(),
  heroImage: z.string(),
  galleryImages: z.array(z.object({ src: z.string(), caption: z.string() })),
  script: z.object({
    greeting: z.string(),
    name: z.string(),
    intro: z.string(),
    chatLine: z.string(),
    sendLabel: z.string(),
    pivotOne: z.string(),
    pivotTwo: z.string(),
    pivotEmphasis: z.string(),
    portrait: z.string(),
    bigText: z.string(),
    closing: z.string(),
    signoff: z.string(),
    replay: z.string()
  })
});

export const tribute = TributeSchema.parse({
  honoree: "Nitin",
  heroImage,
  galleryImages: [
    { src: photoOne, caption: "" },
    { src: photoTwo, caption: "" },
    { src: photoThree, caption: "" }
  ],
  script: {
    greeting: "Hey",
    name: "Nitin",
    intro: "It's your birthday.",
    chatLine: "Happy birthday boss! Have a great one 🎉",
    sendLabel: "Send",
    pivotOne: "That's what we were going to send.",
    pivotTwo: "But you deserve a little ",
    pivotEmphasis: "more",
    portrait: "Here's to the best of us.",
    bigText: "Happy Birthday",
    closing: "Have the best year yet.",
    signoff: "— from your office family",
    replay: "Watch again"
  }
});

export type Tribute = typeof tribute;
