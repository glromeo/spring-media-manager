package org.codebite.springmediamanager.data.bt;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;
import java.time.Duration;
import java.util.Date;

@Document
public class TorrentConfig {

    @Id
    public Long id = 0L;

    @NotNull
    public Date created = new Date();

    public Duration peerDiscoveryInterval;
    public Duration peerHandshakeTimeout;
    public Duration peerConnectionRetryInterval;
    public Integer peerConnectionRetryCount;
    public Duration peerConnectionTimeout;
    public Duration peerConnectionInactivityThreshold;
    public Duration trackerQueryInterval;
    public Integer maxPeerConnections;
    public Integer maxPeerConnectionsPerTorrent;
    public Integer transferBlockSize;
    public Integer maxTransferBlockSize;
    public Integer maxIOQueueSize;
    public Duration shutdownHookTimeout;
    public Integer numOfHashingThreads;
    public Integer maxConcurrentlyActivePeerConnectionsPerTorrent;
    public Duration maxPieceReceivingTime;
    public Duration maxMessageProcessingInterval;
    public Duration unreachablePeerBanDuration;
    public Integer maxPendingConnectionRequests;
    public Duration timeoutedAssignmentPeerBanDuration;
    public String encryptionPolicy;
    public Integer metadataExchangeBlockSize;
    public Integer metadataExchangeMaxSize;
    public Integer msePrivateKeySize;
    public Integer numberOfPeersToRequestFromTracker;
}
