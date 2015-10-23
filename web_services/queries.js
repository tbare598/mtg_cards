exports.planechaseQuery =
  "SELECT MAX(crd.Multiverse_ID) Multiverse_ID, "
+ "       crd.Name               Name"
+ "  FROM T_CARDS crd "
+ " INNER JOIN T_CARD_TYPES"
+ " types ON crd.Multiverse_id = types.Multiverse_ID"
+ "      AND crd.Name          = types.Name"
+ " WHERE types.Type = 'Plane'"
+ "   OR types.Type = 'Phenomenon'"
+ " GROUP BY crd.Name,"
+ "          crd.Multiverse_ID,"
+ "          types.Type";

