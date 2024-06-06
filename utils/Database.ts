import {Message, Role, Ticket} from '@/utils/interfaces';
import {type SQLiteDatabase} from 'expo-sqlite/next';
import * as FileSystem from 'expo-file-system';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    // Log DB path for debugging
    // console.log(FileSystem.documentDirectory);
    const DATABASE_VERSION = 1;
    let result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        const result = await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            
            CREATE TABLE tickets (
                id TEXT PRIMARY KEY NOT NULL,
                uri TEXT,
                base64 STRING,
                type TEXT 
            )
            
            
        `);

        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }

    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addTicketToQueue = async (db: SQLiteDatabase, ticket: Ticket, type: 'pending' | 'error') => {
    const {id, uri , base64} = ticket;
    return await db.runAsync('INSERT INTO tickets (id, uri, base64, type) VALUES (?, ?, ?, ?)', [id, uri, base64, type])
}

export const removeTicketFromQueue = async (db: SQLiteDatabase, id: string, type: 'pending' | 'error') => {
    return await db.runAsync('DELETE FROM tickets WHERE type = ? AND id = ?', [type, id])
}

export const getTickets = async (db: SQLiteDatabase, type: string): Promise<Ticket[]> => {
    return await db.getAllAsync<Ticket>('SELECT * FROM tickets WHERE type = ?', [type]);
};

export const clearTicketsTable = async (db: SQLiteDatabase) => {
    return await db.runAsync('DELETE FROM tickets')
}
