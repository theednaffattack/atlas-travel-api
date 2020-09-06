# Zapatos How To's

[Zapatos docs](https://jawj.github.io/zapatos/)

[Zapatos Github](https://github.com/jawj/zapatos)

```typescript
const requestLeaveForDoctorOnDay = async (doctorId: number, day: string) =>
  db.transaction(pool, db.Isolation.Serializable, async (txnClient) => {
    const otherDoctorsOnShift = await db
      .count("shifts", {
        doctorId: db.sql<db.SQL>`${db.self} != ${db.param(doctorId)}`,
        day,
      })
      .run(txnClient);
    if (otherDoctorsOnShift === 0) return false;

    await db.deletes("shifts", { day, doctorId }).run(txnClient);
    return true;
  });

const [leaveBookedForAnnabel, leaveBookedForBrian] = await Promise.all([
  // in practice, these requests would come from different front-ends
  requestLeaveForDoctorOnDay(1, "2020-12-25"),
  requestLeaveForDoctorOnDay(2, "2020-12-25"),
]);

console.log(`Leave booked for:
  Annabel – ${leaveBookedForAnnabel}
  Brian – ${leaveBookedForBrian}`);
```
