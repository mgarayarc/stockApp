package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.*;
import com.mycompany.myapp.service.dto.QuoteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Quote} and its DTO {@link QuoteDTO}.
 */
@Mapper(componentModel = "spring", uses = { StockMapper.class })
public interface QuoteMapper extends EntityMapper<QuoteDTO, Quote> {
    @Mapping(target = "stock", source = "stock", qualifiedByName = "name")
    QuoteDTO toDto(Quote s);
}
