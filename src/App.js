import React, { useState, useEffect } from "react";
import { db } from "./config/Firebase"; // Sesuaikan path dengan file firebase.js
import { ref, onValue } from "firebase/database";

function App() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [status, setStatus] = useState("Aman");
  const [dataset, setDataset] = useState([[0]]); // Dataset awal untuk k-means

  // Mengambil dataset dari Firebase
  useEffect(() => {
    const waterLevelRef = ref(db, "Iot/kel5/air");
    onValue(waterLevelRef, (snapshot) => {
      const level = snapshot.val(); // Ambil nilai terbaru
      setWaterLevel(level);

      // Tambahkan level ke dataset untuk clustering
      setDataset((prevDataset) => [...prevDataset, [level]]);
    });
  }, []);

  // Terapkan k-means clustering ke dataset
  useEffect(() => {
    if (dataset.length > 3) {
      // Jalankan k-means hanya jika dataset mencukupi
      const { centroids } = kmeans(dataset, 3); // Cluster menjadi 3

      // Cari cluster untuk waterLevel terbaru
      updateStatus(waterLevel, centroids);
    }
  }, [dataset, waterLevel]);

  // K-means Algorithm
  const kmeans = (dataset, k) => {
    const centroids = initializeCentroids(dataset, k);
    let clusters = [];
    let oldCentroids = [];

    while (!hasConverged(oldCentroids, centroids)) {
      oldCentroids = [...centroids];
      clusters = assignClusters(dataset, centroids);
      updateCentroids(clusters, dataset, centroids);
    }

    return { centroids, clusters };
  };

  const initializeCentroids = (dataset, k) => {
    const centroids = [];
    const step = Math.floor(dataset.length / k);
    for (let i = 0; i < k; i++) {
      centroids.push(dataset[i * step]);
    }
    return centroids;
  };

  const assignClusters = (dataset, centroids) => {
    return dataset.map((point) => {
      const distances = centroids.map((centroid) =>
        Math.abs(point[0] - centroid[0])
      );
      return distances.indexOf(Math.min(...distances));
    });
  };

  const updateCentroids = (clusters, dataset, centroids) => {
    const sums = centroids.map(() => 0);
    const counts = centroids.map(() => 0);

    clusters.forEach((cluster, i) => {
      sums[cluster] += dataset[i][0];
      counts[cluster]++;
    });

    counts.forEach((count, i) => {
      if (count > 0) centroids[i][0] = sums[i] / count;
    });
  };

  const hasConverged = (oldCentroids, centroids) => {
    return oldCentroids.every(
      (oldCentroid, i) => oldCentroid[0] === centroids[i][0]
    );
  };

  // Menentukan status berdasarkan cluster
  const updateStatus = (level, centroids) => {
    const distances = centroids.map((centroid) =>
      Math.abs(level - centroid[0])
    );
    const clusterIndex = distances.indexOf(Math.min(...distances));

    if (clusterIndex === 0) setStatus("Aman");
    else if (clusterIndex === 1) setStatus("Siaga");
    else setStatus("Bahaya Dan Lampu Alarm Menyala");
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Monitoring Ketinggian Air
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-2xl font-semibold">Ketinggian Air:</p>
        <p className="text-6xl font-bold text-blue-500">{waterLevel} cm</p>
        <p
          className={`text-xl font-medium mt-4 ${
            status === "Aman"
              ? "text-green-500"
              : status === "Siaga"
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          Status: {status}
        </p>
      </div>
    </div>
  );
}

export default App;
