export const noteNames = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const keyBinds: { [key: string]: string | undefined } = {
    Backquote: "Bb2",
    Tab: "B2",
    KeyQ: "C3",
    Digit2: "Db3",
    KeyW: "D3",
    Digit3: "Eb3",
    KeyE: "E3",
    KeyR: "F3",
    Digit5: "Gb3",
    KeyT: "G3",
    Digit6: "Ab3",
    KeyY: "A3",
    Digit7: "Bb3",
    KeyU: "B3",
    KeyI: "C4",
    Digit9: "Db4",
    KeyO: "D4",
    Digit0: "Eb4",
    KeyP: "E4",
    BracketLeft: "F4",
    Equal: "Gb4",
    BracketRight: "G4",
    Backspace: "Ab4",
    Backslash: "A4",
    ShiftLeft: "A4",
    KeyA: "Bb4",
    KeyZ: "B4",
    KeyX: "C5",
    KeyD: "Db5",
    KeyC: "D5",
    KeyF: "Eb5",
    KeyV: "E5",
    KeyB: "F5",
    KeyH: "Gb5",
    KeyN: "G5",
    KeyJ: "Ab5",
    KeyM: "A5",
    KeyK: "Bb5",
    Comma: "B5",
    Period: "C6",
    Semicolon: "Db6",
    Slash: "D6",
    Quote: "Eb6",
    ShiftRight: "E6",
    Enter: "F6",
};

export function getOctave(note: string): number {
    return parseInt(note.charAt(note.length - 1));
}

export function getNoteName(note: string): string {
    return note.substring(0, note.length - 1);
}

import type { Player } from "soundfont-player";

export interface INote {
    pressed: boolean;
    white: boolean;
    audioNode: Player | null;
}

type INoteMap = { [key: string]: INote | undefined };

export function generateNoteMapFromRange(
    startNote: string,
    endNote: string
): { noteMap: INoteMap; whiteKeys: number } {
    const endOctave = getOctave(endNote);
    const startOctave = getOctave(startNote);
    const startNoteNameIndex = noteNames.indexOf(getNoteName(startNote));
    const endNoteNameIndex = noteNames.indexOf(getNoteName(endNote));

    const noteMap: INoteMap = {};
    let whiteKeys = 0;
    // go through each octave
    for (let octave = startOctave; octave <= endOctave; octave++) {
        // if first octave start from `startNote` else use C
        let noteNameIndex = octave === startOctave ? startNoteNameIndex : 0;

        // go through each key
        while (noteNameIndex < noteNames.length) {
            const reachedEndNote = octave === endOctave && noteNameIndex > endNoteNameIndex;
            if (reachedEndNote) break;
            const noteName = noteNames[noteNameIndex];

            const white = noteName.length === 1;
            noteMap[noteName + octave] = { white, pressed: false, audioNode: null };
            if (white) whiteKeys++;

            noteNameIndex++;
        }
    }

    return { noteMap, whiteKeys };
}

export function midiToNote(midiNote: number) {
    const octave = Math.floor(midiNote / 12) - 1;
    const note = noteNames[midiNote % 12];
    return note + octave;
}