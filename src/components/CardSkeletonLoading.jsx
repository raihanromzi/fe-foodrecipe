import { Box, Card, CardContent, Skeleton } from "@mui/material";

const CardSkeletonLoading = () => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Skeleton variant="rectangular" width="100%" height={100} />
      <CardContent>
        <Box display="flex" justifyContent="space-between" marginBottom={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={50} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={50} />
        </Box>
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={150} />
        <Box display="flex" justifyContent="space-between" marginTop={1}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={50} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={50} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardSkeletonLoading;
