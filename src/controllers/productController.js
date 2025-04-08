import { Product } from "../models/index.js";

const nonDollarMonthMap = {
  0: "F", // Janeiro
  2: "H", // Março
  4: "K", // Maio
  6: "N", // Julho
  7: "Q", // Agosto
  8: "U", // Setembro
  10: "X", // Novembro
};

const dollarMonthMap = {
  0: "F", // Janeiro
  1: "G", // Fevereiro
  2: "H", // Março
  3: "J", // Abril
  4: "K", // Maio
  5: "M", // Junho
  6: "N", // Julho
  7: "Q", // Agosto
  8: "U", // Setembro
  9: "V", // Outubro
  10: "X", // Novembro
  11: "Z", // Dezembro
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function getLastWorkingDayBefore(year, month, day) {
  const date = new Date(year, month, day);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }

  return date;
}

function getSecondLastWorkingDayBeforeMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  firstDay.setDate(firstDay.getDate() - 1);

  let workingDays = 0;
  while (workingDays < 2) {
    if (firstDay.getDay() !== 0 && firstDay.getDay() !== 6) {
      workingDays++;
    }
    if (workingDays < 2) {
      firstDay.setDate(firstDay.getDate() - 1);
    }
  }

  return firstDay;
}

export async function listProductTickers(req, reply) {
  const { product } = req.params;

  const monthMap =
    product === "WDO" || product === "SJC" ? dollarMonthMap : nonDollarMonthMap;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let tickers = [];
  const monthKeys = Object.keys(monthMap).map(Number);
  const maxIterations = 24;

  let cutoffDate;
  if (product === "CCM") {
    cutoffDate = getLastWorkingDayBefore(currentYear, currentMonth, 15);
  } else if (product === "SJC") {
    cutoffDate = getSecondLastWorkingDayBeforeMonth(currentYear, currentMonth);
  } else if (product === "WDO") {
    cutoffDate = getLastWorkingDayBefore(currentYear, currentMonth + 1, 1);
  }

  let count = 0;
  let i = 1;

  while (count < 4 && i <= maxIterations) {
    const nextMonth = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    if (product === "WDO" || monthKeys.includes(nextMonth)) {
      const ticker = `${product}${monthMap[nextMonth]}${year}`;
      const name = `${monthNames[nextMonth]}/${year}`;

      tickers.push({ id: ticker, name });
      count++;
    }

    i++;
  }

  if (i > maxIterations) {
    throw new Error("Excedeu número máximo de iterações.");
  }

  reply.send({ data: { tickers } });
}

export async function listProducts(req, reply) {
  const { limit = 10, page = 1 } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    reply.code(400).send({ error: "Paginação inválida." });
    return;
  }

  const offsetInt = (pageInt - 1) * limitInt;

  const products = await Product.findAll({
    limit: limitInt,
    offset: offsetInt,
  });

  const total = await Product.count();
  const totalPages = Math.ceil(total / limitInt);

  reply.code(200).send({
    data: { list: products, totalPages, currentPage: pageInt, total },
  });
}

export async function getProduct(req, reply) {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  if (!product) {
    reply.code(404).send({ message: "Oportunidade não encontrada" });
    return;
  }

  reply.code(200).send({
    data: { product },
  });
}

export async function upsertProduct(req, reply) {
  const { user } = req;
  const { id } = req.params;
  const { recommendation, commentary = "" } = req.body;

  const product = await Product.update(
    {
      id,
      recommendation,
      commentary,
      updatedBy: user.id,
    },
    { where: { id } }
  );

  reply.send({
    data: { product, message: "Oportunidade atualizada com sucesso." },
  });
}

export async function deleteProduct(req, reply) {
  const productId = req.params.id;

  const result = await Product.destroy({ where: { id: productId } });

  if (result === 0) {
    reply.code(404).send({ message: "Oportunidade não encontrada" });
  } else {
    reply.code(200).send({ data: { message: "Oportunidade excluída" } });
  }
}
