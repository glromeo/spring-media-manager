package org.codebite.springmediamanager.data.mongodb;

import bt.protocol.crypto.EncryptionPolicy;
import bt.runtime.Config;
import org.codebite.springmediamanager.data.bt.TorrentConfig;

import static java.util.Optional.ofNullable;

public abstract class TorrentConfigMapper {

    public static Config toConfig(TorrentConfig tc) {
        Config config = new Config();
        ofNullable(tc.peerDiscoveryInterval).ifPresent(config::setPeerDiscoveryInterval);
        ofNullable(tc.peerHandshakeTimeout).ifPresent(config::setPeerHandshakeTimeout);
        ofNullable(tc.peerConnectionRetryInterval).ifPresent(config::setPeerConnectionRetryInterval);
        ofNullable(tc.peerConnectionRetryCount).ifPresent(config::setPeerConnectionRetryCount);
        ofNullable(tc.peerConnectionTimeout).ifPresent(config::setPeerConnectionTimeout);
        ofNullable(tc.peerConnectionInactivityThreshold).ifPresent(config::setPeerConnectionInactivityThreshold);
        ofNullable(tc.trackerQueryInterval).ifPresent(config::setTrackerQueryInterval);
        ofNullable(tc.maxPeerConnections).ifPresent(config::setMaxPeerConnections);
        ofNullable(tc.maxPeerConnectionsPerTorrent).ifPresent(config::setMaxPeerConnectionsPerTorrent);
        ofNullable(tc.transferBlockSize).ifPresent(config::setTransferBlockSize);
        ofNullable(tc.maxTransferBlockSize).ifPresent(config::setMaxTransferBlockSize);
        ofNullable(tc.maxIOQueueSize).ifPresent(config::setMaxIOQueueSize);
        ofNullable(tc.shutdownHookTimeout).ifPresent(config::setShutdownHookTimeout);
        ofNullable(tc.numOfHashingThreads).ifPresent(config::setNumOfHashingThreads);
        ofNullable(tc.maxConcurrentlyActivePeerConnectionsPerTorrent).ifPresent(config::setMaxConcurrentlyActivePeerConnectionsPerTorrent);
        ofNullable(tc.maxPieceReceivingTime).ifPresent(config::setMaxPieceReceivingTime);
        ofNullable(tc.maxMessageProcessingInterval).ifPresent(config::setMaxMessageProcessingInterval);
        ofNullable(tc.unreachablePeerBanDuration).ifPresent(config::setUnreachablePeerBanDuration);
        ofNullable(tc.maxPendingConnectionRequests).ifPresent(config::setMaxPendingConnectionRequests);
        ofNullable(tc.timeoutedAssignmentPeerBanDuration).ifPresent(config::setTimeoutedAssignmentPeerBanDuration);
        ofNullable(tc.encryptionPolicy).map(EncryptionPolicy::valueOf).ifPresent(config::setEncryptionPolicy);
        ofNullable(tc.metadataExchangeBlockSize).ifPresent(config::setMetadataExchangeBlockSize);
        ofNullable(tc.metadataExchangeMaxSize).ifPresent(config::setMetadataExchangeMaxSize);
        ofNullable(tc.msePrivateKeySize).ifPresent(config::setMsePrivateKeySize);
        ofNullable(tc.numberOfPeersToRequestFromTracker).ifPresent(config::setNumberOfPeersToRequestFromTracker);
        return config;
    }

    public static TorrentConfig toTorrentConfig(Config config) {
        TorrentConfig tc = new TorrentConfig();
        tc.peerDiscoveryInterval = config.getPeerDiscoveryInterval();
        tc.peerHandshakeTimeout = config.getPeerHandshakeTimeout();
        tc.peerConnectionRetryInterval = config.getPeerConnectionRetryInterval();
        tc.peerConnectionRetryCount = config.getPeerConnectionRetryCount();
        tc.peerConnectionTimeout = config.getPeerConnectionTimeout();
        tc.peerConnectionInactivityThreshold = config.getPeerConnectionInactivityThreshold();
        tc.trackerQueryInterval = config.getTrackerQueryInterval();
        tc.maxPeerConnections = config.getMaxPeerConnections();
        tc.maxPeerConnectionsPerTorrent = config.getMaxPeerConnectionsPerTorrent();
        tc.transferBlockSize = config.getTransferBlockSize();
        tc.maxTransferBlockSize = config.getMaxTransferBlockSize();
        tc.maxIOQueueSize = config.getMaxIOQueueSize();
        tc.shutdownHookTimeout = config.getShutdownHookTimeout();
        tc.numOfHashingThreads = config.getNumOfHashingThreads();
        tc.maxConcurrentlyActivePeerConnectionsPerTorrent = config.getMaxConcurrentlyActivePeerConnectionsPerTorrent();
        tc.maxPieceReceivingTime = config.getMaxPieceReceivingTime();
        tc.maxMessageProcessingInterval = config.getMaxMessageProcessingInterval();
        tc.unreachablePeerBanDuration = config.getUnreachablePeerBanDuration();
        tc.maxPendingConnectionRequests = config.getMaxPendingConnectionRequests();
        tc.timeoutedAssignmentPeerBanDuration = config.getTimeoutedAssignmentPeerBanDuration();
        tc.encryptionPolicy = config.getEncryptionPolicy().name();
        tc.metadataExchangeBlockSize = config.getMetadataExchangeBlockSize();
        tc.metadataExchangeMaxSize = config.getMetadataExchangeMaxSize();
        tc.msePrivateKeySize = config.getMsePrivateKeySize();
        tc.numberOfPeersToRequestFromTracker = config.getNumberOfPeersToRequestFromTracker();
        return tc;
    }

}
