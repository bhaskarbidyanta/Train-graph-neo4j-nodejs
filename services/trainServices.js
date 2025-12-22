const driver = require("../config/neo4j");

exports.findTrains = async (from, to) => {
    if (!from || !to) {
        throw new Error('Missing from or to parameter');
    }

    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    const query = `
        MATCH (t:Train)-[r1:STOPS_AT]->(from:Station {name:$from})
        MATCH (t)-[r2:STOPS_AT]->(to:Station {name:$to})
        WHERE r1.sequence < r2.sequence
        RETURN t.train_no AS train_no,
            t.name AS name,
            r1.departure_time AS dep_time, 
            r2.arrival_time AS arr_time,
            (r2.arrival_day_offset*1440 + toInteger(split(r2.arrival_time,':')[0])*60 + toInteger(split(r2.arrival_time,':')[1])) -
            (r1.departure_day_offset*1440 + toInteger(split(r1.departure_time,':')[0])*60 + toInteger(split(r1.departure_time,':')[1])) AS duration
        ORDER BY duration
            `;
        try {
            const result = await session.run(query, { from, to });
            return result.records.map(r => r.toObject());
        } finally {
            await session.close();
        }
};

exports.getTimeline = async (trainNo) => {
  const session = driver.session();

  const query = `
    MATCH (t:Train {train_no:$trainNo})-[r:STOPS_AT]->(s:Station)
    RETURN r.sequence, s.name, r.arrival_time, r.departure_time, r.platform
    ORDER BY r.sequence
  `;

  try {
    const result = await session.run(query, { trainNo });
    return result.records.map(r => r.toObject());
  } finally {
    await session.close();
  }
};

exports.getAllTrains = async () => {
  const session = driver.session({
    database: process.env.NEO4J_DATABASE
  });

  try {
    const result = await session.run(`
      MATCH (t:Train)
      RETURN t.train_no AS train_no, t.name AS name
      ORDER BY t.train_no
    `);

    return result.records.map(r => ({
      train_no: r.get("train_no"),
      name: r.get("name")
    }));
  } finally {
    await session.close();
  }
};