"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Box,
  Grid,
  Heading,
  Text,
  Spinner,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useBodyTypeStore } from "../stores/useBodyTypeStore";

const MotionBox = motion(Box);

export default function PopularBodyTypes() {
  const { bodyTypes, loading, fetchBodyTypes } = useBodyTypeStore();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (bodyTypes.length === 0) fetchBodyTypes();
  }, [fetchBodyTypes, bodyTypes.length]);

  // Show only 12 if showAll is false
  const displayedBodyTypes = showAll ? bodyTypes : bodyTypes.slice(0, 12);

  return (
    <Box py={12} bg="white">
      <Box maxW="7xl" mx="auto" px={4}>
        {/* Section Title */}
        <VStack spacing={3} textAlign="center" mb={10}>
          <Heading size="2xl" color="gray.800">
            Popular Cars By Body Types
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Choose from a variety of body styles to find your perfect match
          </Text>
        </VStack>

        {/* Loader */}
        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="#1da1f3" thickness="4px" />
          </Box>
        )}

        {/* Body Types Grid */}
        {!loading && bodyTypes.length > 0 && (
          <>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(6, 1fr)",
              }}
              gap={6}
            >
              {displayedBodyTypes.map((body, index) => (
                <Link
                  key={body.body_type_id}
                  href={`/vehicles/bodyType=${body.body_type_id}`}
                  passHref
                >
                  <MotionBox
                    bg="#1da1f3"
                    shadow="md"
                    borderWidth="1px"
                    rounded="xl"
                    textAlign="center"
                    p={5}
                    whileHover={{
                      scale: 1.08,
                      boxShadow: "0 8px 25px rgba(29, 161, 243, 0.4)",
                    }}
                    transition={{ duration: 0.3 }}
                    cursor="pointer"
                  >
                    <Box position="relative" w="80px" h="80px" mx="auto">
                      <Image
                        src={`/assets/images/car-body/png/${(index % 12) + 1}.png`}
                        alt={body.body_type_name}
                        fill
                        sizes="80px"
                        className="object-contain"
                        priority={index < 6} // Optimize above-the-fold images
                      />
                    </Box>
                    <Text
                      mt={4}
                      fontSize="md"
                      fontWeight="bold"
                      color="white"
                      noOfLines={1}
                    >
                      {body.body_type_name}
                    </Text>
                  </MotionBox>
                </Link>
              ))}
            </Grid>

            {/* Show More / Show Less Button */}
            {bodyTypes.length > 12 && (
              <Box textAlign="center" mt={8}>
                <Button
                  onClick={() => setShowAll(!showAll)}
                  bg="#1da1f3"
                  color="white"
                  size="lg"
                  rounded="full"
                  px={8}
                  _hover={{ bg: "#0c8cd4" }}
                  transition="all 0.3s ease-in-out"
                >
                  {showAll ? "Show Less" : "Show More"}
                </Button>
              </Box>
            )}
          </>
        )}

        {/* No Body Types */}
        {!loading && bodyTypes.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No body types available right now.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
