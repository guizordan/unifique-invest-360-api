import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import { News } from "../models/index.js";

export async function listNews(req, reply) {
  const { limit = 10, page = 1 } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    reply.code(400).send({ error: "Paginação inválida." });
    return;
  }

  const offsetInt = (pageInt - 1) * limitInt;

  const news = await News.findAll({
    limit: limitInt,
    offset: offsetInt,
    order: [["createdAt", "DESC"]],
  });

  const total = await News.count();
  const totalPages = Math.ceil(total / limitInt);

  reply.code(200).send({
    data: { list: news, totalPages, currentPage: pageInt, total },
  });
}

export async function getNews(req, reply) {
  const { id } = req.params;

  const news = await News.findByPk(id);

  if (!news) {
    reply.code(404).send({ message: "Notícia não encontrada" });
    return;
  }

  reply.code(200).send({
    data: { news },
  });
}

export async function createNews(req, reply) {
  const formData = {};
  const parts = req.parts();

  let imagePath = "";
  let customId = uuidv4();

  for await (const part of parts) {
    if (part.file && part.filename) {
      const filename = customId + "-" + part.filename;
      imagePath = "static/uploads/news/" + filename;

      const uploadPath = path.join(process.cwd(), imagePath);

      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      const writeStream = fs.createWriteStream(uploadPath);
      await part.file.pipe(writeStream);
      console.log(`News image saved into: ${uploadPath}`);
    } else {
      if (part.value && part.value !== "undefined") {
        formData[part.fieldname] = part.value;
      }
    }
  }

  const {
    title = "",
    embedded = false,
    embeddedUrl = "",
    body = "",
  } = formData;

  const news = await News.create({
    id: customId,
    title,
    embedded,
    embeddedUrl,
    body,
    imagePath,
  });

  reply.send({
    data: { news, message: "Notícia criada com sucesso." },
  });
}

export async function updateNews(req, reply) {
  const { id } = req.params;
  const parts = req.parts();

  const formData = {};
  let newImagePath = "";
  let customId = uuidv4();

  for await (const part of parts) {
    if (part.file && part.filename) {
      const filename = customId + "-" + part.filename;
      newImagePath = "static/uploads/news/" + filename;

      const uploadPath = path.join(process.cwd(), newImagePath);

      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      const writeStream = fs.createWriteStream(uploadPath);
      await part.file.pipe(writeStream);
      console.log(`News image saved into: ${uploadPath}`);
    } else {
      if (part.value && part.value !== "undefined") {
        formData[part.fieldname] = part.value;
      }
    }
  }

  const {
    title = "",
    embedded = false,
    embeddedUrl = "",
    body = "",
  } = formData;

  const existingNews = await News.findByPk(id);

  if (!existingNews) {
    return reply.code(404).send({ message: "Notícia não encontrada." });
  }

  if (newImagePath) {
    const oldImagePath = path.join(process.cwd(), existingNews.imagePath);

    if (fs.existsSync(oldImagePath)) {
      const isFile = fs.lstatSync(oldImagePath).isFile();

      if (isFile) {
        fs.unlinkSync(oldImagePath);
        console.log(`Old image deleted: ${oldImagePath}`);
      } else {
        console.log(`Old image not found, or not deleted.`);
      }
    }
  }

  const updatedNews = await existingNews.update({
    title,
    embedded,
    embeddedUrl,
    body,
    imagePath: newImagePath || existingNews.imagePath,
  });

  reply.send({
    data: { news: updatedNews, message: "Notícia atualizada com sucesso." },
  });
}

export async function deleteNews(req, reply) {
  const newsId = req.params.id;

  const existingNews = await News.findByPk(newsId);

  if (!existingNews) {
    return reply.code(404).send({ message: "Notícia não encontrada" });
  }

  const imagePath = path.join(process.cwd(), existingNews.imagePath);
  console.log("Attempting to delete image at:", imagePath);

  if (fs.existsSync(imagePath)) {
    const isFile = fs.lstatSync(imagePath).isFile();

    if (isFile) {
      fs.unlinkSync(imagePath);
      console.log(`Image deleted: ${imagePath}`);
    } else {
      console.log(`Image not found, or not deleted.`);
    }
  }

  await News.destroy({ where: { id: newsId } });
  reply.code(200).send({ data: { message: "Notícia excluída" } });
}
