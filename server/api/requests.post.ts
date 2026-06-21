// server/api/requests.post.ts
import { readBody } from 'h3';
import mysql from 'mysql2/promise';

// Конфигурация базы данных
const dbConfig = {
    host: 'localhost',
    user: 'etl_spb_ru_usr',
    password: '~:_B8H1[t4c#VLUj',
    database: 'etl_spb_ru',
};

export default defineEventHandler(async (event) => {
    try {
        // Получаем данные из формы
        const body = await readMultipartFormData(event);

        // Если это JSON запрос, используем readBody
        // const body = await readBody(event);

        console.log('Получена заявка:', body);

        // Парсим данные формы
        let formData: any = {};
        if (body) {
            body.forEach(field => {
                if (field.name) {
                    formData[field.name] = field.data.toString('utf-8');
                }
            });
        }

        const { name, phone, email, message, consent } = formData;

        // Валидация
        if (!name || !phone) {
            return {
                success: false,
                message: 'Имя и телефон обязательны для заполнения'
            };
        }

        if (consent !== 'true' && consent !== 'on') {
            return {
                success: false,
                message: 'Необходимо согласие на обработку персональных данных'
            };
        }

        // Сохраняем в базу данных
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            `INSERT INTO requests (name, phone, email, message, status, created_at)
             VALUES (?, ?, ?, ?, 'pending', NOW())`,
            [name, phone, email || null, message || null]
        );

        await connection.end();

        const insertId = (result as any).insertId;

        return {
            success: true,
            message: 'Заявка успешно создана',
            data: {
                id: insertId,
                status: 'pending'
            }
        };

    } catch (error: any) {
        console.error('Ошибка:', error);
        return {
            success: false,
            message: error.message || 'Внутренняя ошибка сервера'
        };
    }
});